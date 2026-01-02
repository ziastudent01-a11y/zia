import * as XLSX from "xlsx";

export function readExcel<T = any>(buffer: Buffer): T[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false,
  }) as T[];
}
