import XLSX from "xlsx-js-style";

/**
 * Fungsi cerdas untuk meng-export array of objects ke file Excel (.xlsx)
 * Dilengkapi dengan Auto-Fit Column Width dan Styling Header Enterprise.
 */
export const exportToExcel = <T extends Record<string, unknown>>(
  data: T[],
  fileName: string,
  sheetName: string = "Laporan",
) => {
  if (!data || data.length === 0) return;

  // 1. Ubah JSON ke Worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  // 2. STYLING HEADER (Baris Pertama)
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");

  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + "1";
    if (!worksheet[address]) continue;

    worksheet[address].s = {
      fill: { fgColor: { rgb: "EA580C" } }, // Orange-600 (Standar Enterprise)
      font: { color: { rgb: "FFFFFF" }, bold: true, sz: 12 },
      alignment: { vertical: "center", horizontal: "center" },
      border: {
        bottom: { style: "thick", color: { rgb: "000000" } },
      },
    };
  }

  // 3. AUTO-WIDTH KALKULATOR (Dynamic Columns)
  // Membaca key dari object pertama untuk menghitung panjang karakter
  const colWidths = Object.keys(data[0]).map((key) => {
    // Cari string terpanjang antara nama Header (key) atau isi datanya
    const maxLength = data.reduce((max, row) => {
      const cellValue =
        row[key] !== null && row[key] !== undefined ? row[key].toString() : "";
      return Math.max(max, cellValue.length);
    }, key.length); // Inisialisasi awal dengan panjang nama kolom

    // Berikan padding +4 karakter agar tidak terlalu mepet (maksimal lebar 50)
    return { wch: Math.min(maxLength + 4, 50) };
  });

  worksheet["!cols"] = colWidths;

  // 4. GENERATE FILE
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
