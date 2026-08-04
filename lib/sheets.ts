import { google, sheets_v4 } from "googleapis";

export type RsvpData = {
  name: string;
  attending: string; // "Yes" | "No"
  dietary: string;
  plusOne: string;
  emails: string;
  notes: string;
};

const TAB = "RSVPs";
const RANGE = `${TAB}!A:G`;
const HEADER = ["Name", "RSVP", "Dietary", "Plus One", "Emails", "Notes", "Updated"];

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function sheetsClient() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

function lastName(full: string) {
  const parts = full.trim().split(/\s+/);
  return (parts[parts.length - 1] || "").toLowerCase();
}

export async function getSpreadsheetMeta(): Promise<{ title: string; tabs: string[] }> {
  const sheets = sheetsClient();
  const res = await sheets.spreadsheets.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    fields: "properties.title,sheets.properties.title",
  });
  return {
    title: res.data.properties?.title ?? "",
    tabs: (res.data.sheets ?? []).map((s) => s.properties?.title ?? "").filter(Boolean),
  };
}

// All roster rows keyed by lowercased name (skips the header row).
export async function getRsvpIndex(): Promise<Map<string, { rowIndex: number; data: RsvpData }>> {
  const sheets = sheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: RANGE,
  });

  const rows = res.data.values ?? [];
  const map = new Map<string, { rowIndex: number; data: RsvpData }>();
  for (let i = 0; i < rows.length; i++) {
    const name = rows[i][0];
    if (!name || String(name).toLowerCase() === "name") continue; // skip header
    map.set(String(name).toLowerCase(), {
      rowIndex: i + 1,
      data: {
        name: rows[i][0] ?? "",
        attending: rows[i][1] ?? "",
        dietary: rows[i][2] ?? "",
        plusOne: rows[i][3] ?? "",
        emails: rows[i][4] ?? "",
        notes: rows[i][5] ?? "",
      },
    });
  }
  return map;
}

function rowValues(data: RsvpData) {
  return [data.name, data.attending, data.dietary, data.plusOne, data.emails, data.notes, new Date().toISOString()];
}

export async function appendRsvpRow(data: RsvpData) {
  const sheets = sheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: RANGE,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [rowValues(data)] },
  });
}

export async function updateRsvpRow(rowIndex: number, data: RsvpData) {
  const sheets = sheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${TAB}!A${rowIndex}:G${rowIndex}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [rowValues(data)] },
  });
}

// Rebuild the roster: one row per invited name, sorted by last name, RSVP
// status defaulting to "Pending" (existing Yes/No responses are preserved),
// with conditional-formatting colors on the RSVP column.
export async function seedRoster(names: string[]): Promise<{ count: number; formatted: boolean }> {
  const sheets = sheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  const meta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets(properties(sheetId,title),conditionalFormats)",
  });
  const tab =
    (meta.data.sheets ?? []).find((s) => s.properties?.title === TAB) ?? (meta.data.sheets ?? [])[0];
  const sheetId = tab?.properties?.sheetId ?? 0;
  const existingRuleCount = (tab?.conditionalFormats ?? []).length;

  // Preserve any responses already recorded.
  const index = await getRsvpIndex();
  const sorted = [...names].sort((a, b) => lastName(a).localeCompare(lastName(b)) || a.localeCompare(b));
  const rows = sorted.map((n) => {
    const ex = index.get(n.toLowerCase());
    const responded = ex && (ex.data.attending === "Yes" || ex.data.attending === "No");
    return [
      n,
      responded ? ex!.data.attending : "Pending",
      ex?.data.dietary ?? "",
      ex?.data.plusOne ?? "",
      ex?.data.emails ?? "",
      ex?.data.notes ?? "",
      responded ? new Date().toISOString() : "",
    ];
  });

  await sheets.spreadsheets.values.clear({ spreadsheetId, range: `${TAB}!A:Z` });
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${TAB}!A1`,
    valueInputOption: "RAW",
    requestBody: { values: [HEADER, ...rows] },
  });

  // Conditional formatting is best-effort; the roster still seeds if it fails.
  let formatted = false;
  try {
    const range = { sheetId, startRowIndex: 1, startColumnIndex: 1, endColumnIndex: 2 };
    const rule = (
      text: string,
      bg: sheets_v4.Schema$Color,
      fg: sheets_v4.Schema$Color
    ): sheets_v4.Schema$Request => ({
      addConditionalFormatRule: {
        index: 0,
        rule: {
          ranges: [range],
          booleanRule: {
            condition: { type: "TEXT_EQ", values: [{ userEnteredValue: text }] },
            format: { backgroundColor: bg, textFormat: { foregroundColor: fg } },
          },
        },
      },
    });

    const requests: sheets_v4.Schema$Request[] = [];
    for (let i = existingRuleCount - 1; i >= 0; i--) {
      requests.push({ deleteConditionalFormatRule: { sheetId, index: i } });
    }
    requests.push(rule("Yes", { red: 0.80, green: 0.93, blue: 0.80 }, { red: 0.11, green: 0.42, blue: 0.20 }));
    requests.push(rule("No", { red: 0.98, green: 0.85, blue: 0.83 }, { red: 0.60, green: 0.11, blue: 0.11 }));
    requests.push(rule("Pending", { red: 0.93, green: 0.93, blue: 0.93 }, { red: 0.45, green: 0.45, blue: 0.45 }));

    await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests } });
    formatted = true;
  } catch (e) {
    console.error("seedRoster formatting failed:", e instanceof Error ? e.message : e);
  }

  return { count: rows.length, formatted };
}
