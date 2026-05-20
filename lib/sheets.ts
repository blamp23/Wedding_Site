import { google } from "googleapis";

export async function appendRsvpRow(data: {
  name: string;
  attending: string;
  dietary: string;
  plusOne: string;
}) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "RSVPs!A:E",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          new Date().toISOString(),
          data.name,
          data.attending,
          data.dietary || "—",
          data.plusOne || "—",
        ],
      ],
    },
  });
}
