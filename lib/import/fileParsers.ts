import Papa from "papaparse";
import * as XLSX from "xlsx";

export type NormalizedRow = Record<string, string>;

export type ParsedFileResult = {
  columns: string[];
  rows: NormalizedRow[];
};

const normalizeHeader = (header: string, index: number) => {
  const trimmed = header?.toString().trim();
  return trimmed ? trimmed : `Column ${index + 1}`;
};

export async function parseFileToRows(file: File): Promise<{ columns: string[]; rows: NormalizedRow[] }> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "csv") {
    const csvText = await file.text();
    const parsed = Papa.parse<string[]>(csvText, {
      skipEmptyLines: true
    });
    const [headerRow = [], ...dataRows] = parsed.data as string[][];
    const columns = headerRow.map((header, index) => normalizeHeader(String(header ?? ""), index));
    const rows = dataRows.map((row) => {
      const rowEntries: [string, string][] = columns.map((column, index) => [
        column,
        row?.[index] == null ? "" : String(row[index]).trim()
      ]);
      return Object.fromEntries(rowEntries);
    });

    return { columns, rows };
  }

  if (extension === "xlsx" || extension === "xls") {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const [firstSheetName] = workbook.SheetNames;
    const sheet = workbook.Sheets[firstSheetName];

    if (!sheet) {
      return { columns: [], rows: [] };
    }

    const rowsArray = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      defval: ""
    });

    const [headerRow = [], ...dataRows] = rowsArray;
    const columns = headerRow.map((header, index) => normalizeHeader(String(header), index));

    const rows = dataRows.map((row) => {
      const rowEntries: [string, string][] = columns.map((column, index) => [
        column,
        row?.[index] == null ? "" : String(row[index]).trim()
      ]);
      return Object.fromEntries(rowEntries);
    });

    return { columns, rows };
  }

  return { columns: [], rows: [] };
}
