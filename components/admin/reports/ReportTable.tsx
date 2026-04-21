"use client";

import type { RichReportData } from "@/actions/admin/reports";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function ReportsTable({ data }: { data: RichReportData[] }) {
  if (data.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium">
        Tidak ada data laporan yang cocok.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto max-h-150 custom-scrollbar">
      <Table>
        <TableHeader className="bg-slate-50/80 sticky top-0 z-10 shadow-sm">
          <TableRow>
            <TableHead className="font-bold uppercase text-xs tracking-wider">
              Profil Siswa
            </TableHead>
            <TableHead className="font-bold uppercase text-xs tracking-wider">
              Kontak
            </TableHead>
            <TableHead className="font-bold uppercase text-xs tracking-wider text-center">
              Kehadiran
            </TableHead>
            <TableHead className="font-bold uppercase text-xs tracking-wider text-center">
              Poin & Hadiah
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow
              key={i}
              className="hover:bg-slate-50/50 transition-colors border-slate-100"
            >
              <TableCell className="py-4">
                <div className="space-y-1">
                  <p className="font-black text-slate-800 text-sm">
                    {row["Nama Lengkap"]}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {row["Kelas"]} • {row["Usia"]}
                  </p>
                </div>
              </TableCell>

              <TableCell className="py-4">
                <div className="space-y-1">
                  <p className="font-medium text-slate-700 text-xs">
                    {row["No. Telepon"]}
                  </p>
                  <p className="text-[10px] text-slate-400">{row["Email"]}</p>
                </div>
              </TableCell>

              <TableCell className="py-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg font-black text-blue-600 leading-none">
                    {row["Rutin Hadir"]}x
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] uppercase tracking-widest shadow-none ${row["Status Keaktifan"] === "Pasif" ? "text-red-500 border-red-200 bg-red-50" : "text-green-600 border-green-200 bg-green-50"}`}
                  >
                    {row["Status Keaktifan"]}
                  </Badge>
                </div>
              </TableCell>

              <TableCell className="py-4 text-center">
                <div className="space-y-1.5">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 font-black text-xs border border-orange-100">
                    {row["Total Poin"]} Pts
                  </span>
                  <p
                    className="text-[10px] text-slate-400 max-w-xs mx-auto truncate"
                    title={row["Barang Dibeli"]}
                  >
                    📦 {row["Barang Dibeli"]}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
