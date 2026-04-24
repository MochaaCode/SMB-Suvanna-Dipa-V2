/* eslint-disable @typescript-eslint/no-explicit-any */
import XLSX from "xlsx-js-style";

export const exportToExcel = (
  data: any[],
  fileName: string,
  sheetName: string = "Laporan",
) => {
  exportMultipleSheetsToExcel([{ sheetName, data }], fileName);
};

export const exportMultipleSheetsToExcel = (
  sheetsData: { sheetName: string; data: any[] }[],
  fileName: string,
) => {
  if (!sheetsData || sheetsData.length === 0) return;

  const workbook = XLSX.utils.book_new();

  sheetsData.forEach(({ sheetName, data }) => {
    if (!data || data.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!worksheet[address]) continue;

      worksheet[address].s = {
        fill: { fgColor: { rgb: "EA580C" } },
        font: { color: { rgb: "FFFFFF" }, bold: true, sz: 12 },
        alignment: { vertical: "center", horizontal: "center" },
        border: { bottom: { style: "thick", color: { rgb: "000000" } } },
      };
    }

    const colWidths = Object.keys(data[0]).map((key) => {
      const maxLength = data.reduce((max, row) => {
        const cellValue =
          row[key] !== null && row[key] !== undefined
            ? row[key].toString()
            : "";
        return Math.max(max, cellValue.length);
      }, key.length);
      return { wch: Math.min(maxLength + 4, 50) };
    });

    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
