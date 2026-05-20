import { google } from "googleapis";

type RsvpData = {
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

export async function findExistingRsvp(
  name: string
): Promise<{ rowIndex: number; data: RsvpData } | null> {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "RSVPs!A:F",
  });

  const rows = res.data.values ?? [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][1]?.toLowerCase() === name.toLowerCase()) {
      return {
        rowIndex: i + 1, // 1-indexed sheet row
        data: {
          name: rows[i][1] ?? "",
          attending: rows[i][2] ?? "",
          dietary: rows[i][3] ?? "",
          plusOne: rows[i][4] ?? "",
          notes: rows[i][5] ?? "",
        },
      };
    }
  }
  return null;
}

export async function appendRsvpRow(data: RsvpData) {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "RSVPs!A:F",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        new Date().toISOString(),
        data.name,
        data.attending,
        data.dietary || "—",
        data.plusOne || "—",
        data.notes || "—",
      ]],
    },
  });
}

export async function updateRsvpRow(rowIndex: number, data: RsvpData) {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `RSVPs!A${rowIndex}:F${rowIndex}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        new Date().toISOString(),
        data.name,
        data.attending,
        data.dietary || "—",
        data.plusOne || "—",
        data.notes || "—",
      ]],
    },
  });
}
