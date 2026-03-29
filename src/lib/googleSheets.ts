import { google } from 'googleapis';

export async function appendGuestRow(row: string[]) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || '';

  if (!spreadsheetId || !serviceEmail || !privateKey) {
    throw new Error('Google Sheets environment variables are missing.');
  }

  const auth = new google.auth.JWT({
    email: serviceEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({
    version: 'v4',
    auth,
  });

  const range = sheetName ? `${sheetName}!A:I` : 'A:I';

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [row],
    },
  });
}
