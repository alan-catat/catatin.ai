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

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // HEADER - sesuaikan dengan struktur data yang ada
    const headers = [
      "id",
      "group_name",
      "channel",
      "date",
      "type",
      "category",
      "items",
      "qty",
      "unit",
      "merchant",
      "amount",
      "file_url",
      "created_date",
    ];

    worksheet.addRow(headers);

    // STYLE HEADER
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2E2E2E" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // TAMBAH DATA
    data.forEach((item) => {
      const rowData = headers.map((key) => {
        const val = item[key];

        // Format tanggal
        if (key.includes("date") && val) {
          const d = new Date(val);
          if (!isNaN(d.getTime())) {
            return d.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric"
            });
          }
          return val;
        }

        // Format amount
        if (key === "flow_amount" && val !== undefined && val !== null) {
          const num = Number(val);
          if (!isNaN(num)) {
            return num;
          }
        }

        // Return value atau empty string
        return val ?? "";
      });

      const row = worksheet.addRow(rowData);

      // Style untuk setiap cell
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        // Alignment untuk amount (kolom 13)
        if (colNumber === 13) {
          cell.alignment = { horizontal: "right", vertical: "middle" };
          
          // Format number untuk amount
          if (typeof cell.value === "number") {
            cell.numFmt = '#,##0.00';
            
            // Warna untuk positive/negative
            if (cell.value < 0) {
              cell.font = { color: { argb: "FFDC2626" } };
            } else if (cell.value > 0) {
              cell.font = { color: { argb: "FF16A34A" } };
            }
          }
        } else {
          cell.alignment = { horizontal: "left", vertical: "middle" };
        }
      });
    });

    // AUTO WIDTH dengan max width
    worksheet.columns.forEach((column, idx) => {
      let maxLength = 10;
      const columnKey = headers[idx];

      column.eachCell?.({ includeEmpty: false }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, cellValue.length + 2);
      });

      // Set max width agar tidak terlalu lebar
      column.width = Math.min(maxLength, 50);
    });

    // Freeze header row
    worksheet.views = [
      { state: "frozen", xSplit: 0, ySplit: 1 }
    ];

    // GENERATE FILE
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("Export Excel berhasil!");
  } catch (error) {
    console.error("Error saat export Excel:", error);
    alert("Silakan coba lagi. Pastikan sudah pilih group dan tanggal yang akan di download");
  }
}