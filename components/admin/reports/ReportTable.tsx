"use client";

import { YearlyRecapData } from "@/actions/admin/reports";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ReportsTable({ data }: { data: YearlyRecapData[] }) {
  if (data.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium">
        Tidak ada data laporan yang cocok dengan pencarian.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow>
            <TableHead className="font-bold uppercase text-xs tracking-wider">
              Peringkat & Nama
            </TableHead>
            <TableHead className="font-bold uppercase text-xs tracking-wider">
              Kelas
            </TableHead>
            <TableHead className="font-bold uppercase text-xs tracking-wider text-center">
              Poin
            </TableHead>
            <TableHead className="font-bold uppercase text-xs tracking-wider text-center">
              Kehadiran (H/T/I/A)
            </TableHead>
            <TableHead className="font-bold uppercase text-xs tracking-wider text-right">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow
              key={i}
              className="hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="font-semibold text-slate-800">
                <span className="text-slate-400 mr-2">#{i + 1}</span>{" "}
                {row["Nama Lengkap"]}
              </TableCell>
              <TableCell className="text-slate-600">{row["Kelas"]}</TableCell>
              <TableCell className="text-center font-bold text-orange-600">
                {row["Total Poin"]}
              </TableCell>
              <TableCell className="text-center text-slate-600 font-medium">
                <span className="text-green-600">{row["Total Hadir"]}</span> /{" "}
                <span className="text-yellow-600">
                  {row["Total Terlambat"]}
                </span>{" "}
                /{" "}
                <span className="text-blue-600">{row["Total Izin/Sakit"]}</span>{" "}
                / <span className="text-red-600">{row["Total Alpa"]}</span>
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                    row["Status Keaktifan"] === "Aktif"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {row["Status Keaktifan"]}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
