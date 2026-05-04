import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export interface OrderSheetRow {
  orderNumber: string;
  date: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
}

export async function appendOrderToSheet(row: OrderSheetRow) {
  if (!SPREADSHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    console.warn("Google Sheets env vars not configured — skipping sheet sync");
    return;
  }

  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    // Ensure header row exists on first use
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A1:N1",
    });

    if (!existing.data.values?.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: "Sheet1!A1:N1",
        valueInputOption: "RAW",
        requestBody: {
          values: [[
            "Order Number", "Date", "Full Name", "Phone", "Email",
            "Address", "City", "State", "Pincode",
            "Items", "Total (₹)", "Payment Method", "Payment Status", "Order Status",
          ]],
        },
      });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:N",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[
          row.orderNumber,
          row.date,
          row.fullName,
          row.phone,
          row.email,
          row.address,
          row.city,
          row.state,
          row.pincode,
          row.items,
          row.total,
          row.paymentMethod,
          row.paymentStatus,
          row.orderStatus,
        ]],
      },
    });
  } catch (err) {
    // Never block order creation if sheets fails
    console.error("Google Sheets sync failed:", err);
  }
}

export async function updateSheetPaymentStatus(
  orderNumber: string,
  paymentStatus: string,
  orderStatus: string
) {
  if (!SPREADSHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) return;

  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: "v4", auth });

    // Find the row with matching order number in column A
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:A",
    });

    const rows = res.data.values ?? [];
    const rowIndex = rows.findIndex((r) => r[0] === orderNumber);
    if (rowIndex === -1) return;

    const sheetRow = rowIndex + 1; // 1-indexed
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: "RAW",
        data: [
          { range: `Sheet1!M${sheetRow}`, values: [[paymentStatus]] },
          { range: `Sheet1!N${sheetRow}`, values: [[orderStatus]] },
        ],
      },
    });
  } catch (err) {
    console.error("Google Sheets status update failed:", err);
  }
}
