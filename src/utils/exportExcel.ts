import * as XLSX from "xlsx";

interface ExportOptions {
  fileName?: string;
  sheetName?: string;
}

export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  options: ExportOptions = {}
) {
  const {
    fileName = "export.xlsx",
    sheetName = "Sheet1",
  } = options;

  if (!data || data.length === 0) {
    alert("Tidak ada data untuk diexport.");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const excelBuffer = XLSX.write(workbook, {
    type: "array",
    bookType: "xlsx",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
