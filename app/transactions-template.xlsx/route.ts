import { NextResponse } from "next/server";
import * as xlsx from "xlsx";

const TEMPLATE_NAME = "transactions-template.xlsx";
const SHEET_NAME = "Transactions";

const headers = [
  "Bank/Card Issuer",
  "Account Name",
  "Statement Month (YYYY-MM)",
  "Date (YYYY-MM-DD)",
  "Description",
  "Merchant",
  "Amount",
  "Type (expense|income|savings)",
  "Category"
];

const exampleRow = [
  "Chase",
  "Chase Sapphire",
  "2024-07",
  "2024-07-15",
  "Dinner with clients",
  "La Trattoria",
  -86.5,
  "expense",
  "Dining"
];

export function GET() {
  const workbook = xlsx.utils.book_new();
  const sheet = xlsx.utils.aoa_to_sheet([headers, exampleRow]);
  xlsx.utils.book_append_sheet(workbook, sheet, SHEET_NAME);

  const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=${TEMPLATE_NAME}`,
      "Cache-Control": "no-store"
    }
  });
}
