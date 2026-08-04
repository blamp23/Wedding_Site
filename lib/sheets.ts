import { google } from "googleapis";

export type RsvpData = {
  name: string;
  attending: string;
  dietary: string;
  plusOne: string;
  notes: string;
};

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

// Spreadsheet title + tab names (for diagnostics / health check).
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

// Fetch all RSVP rows, keyed by lowercased name, so we can upsert per person.
export async function getRsvpIndex(): Promise<
  Map<string, { rowIndex: number; data: RsvpData }>
> {
  const sheets = sheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "RSVPs!A:F",
  });

  const rows = res.data.values ?? [];
  const map = new Map<string, { rowIndex: number; data: RsvpData }>();
  for (let i = 0; i < rows.length; i++) {
    const name = rows[i][1];
    if (!name) continue;
    map.set(String(name).toLowerCase(), {
      rowIndex: i + 1, // 1-indexed sheet row
      data: {
        name: rows[i][1] ?? "",
        attending: rows[i][2] ?? "",
        dietary: rows[i][3] ?? "",
        plusOne: rows[i][4] ?? "",
        notes: rows[i][5] ?? "",
      },
    });
  }
  return map;
}

function rowValues(data: RsvpData) {
  return [
    new Date().toISOString(),
    data.name,
    data.attending,
    data.dietary || "",
    data.plusOne || "",
    data.notes || "",
  ];
}

export async function appendRsvpRow(data: RsvpData) {
  const sheets = sheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "RSVPs!A:F",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [rowValues(data)] },
  });
}

export async function updateRsvpRow(rowIndex: number, data: RsvpData) {
  const sheets = sheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `RSVPs!A${rowIndex}:F${rowIndex}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [rowValues(data)] },
  });
}
