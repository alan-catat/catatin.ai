import ExcelJS from "exceljs";

interface ExportOptions {
  fileName?: string;
  sheetName?: string;
}

export async function exportToExcel<T extends Record<string, any>>(
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

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Ambil header dari key data
  const headers = Object.keys(data[0]);

  // Tambahkan header
  worksheet.addRow(headers);

  const headerRow = worksheet.getRow(1);

  // Styling Header
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; // putih
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "2E2E2E" },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    cell.alignment = { horizontal: "center" };
  });

  // Tambahkan data rows
  data.forEach((item) => {
    const row = worksheet.addRow(Object.values(item));

    // border untuk setiap cell
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // Auto column width
  worksheet.columns.forEach((column, colIndex) => {
  let maxLength = 10;

  worksheet.eachRow((row) => {
    const cell = row.getCell(colIndex + 1);
    const value = cell.value ? cell.value.toString() : "";
    maxLength = Math.max(maxLength, value.length + 2);
  });

  column.width = maxLength;
});


  // Generate Buffer untuk browser
  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
