"use client";

import { CalendarCheck, Clock, UserCheck, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { PembinaAttendanceLog } from "@/actions/pembina/logs";

export function PembinaAttendanceTab({
  attendance,
}: {
  attendance: PembinaAttendanceLog[];
}) {
  if (attendance.length === 0) {
    return (
      <div className="py-20 text-center bg-white border border-dashed border-slate-200 rounded-[1.5rem] mt-2 shadow-sm">
        <div className="mx-auto text-slate-300 mb-4 flex justify-center">
          <CalendarCheck size={40} />
        </div>
        <h3 className="text-base font-bold text-slate-700 mb-1">
          Data Masih Kosong
        </h3>
        <p className="text-xs font-medium text-slate-400 px-10">
          Belum ada riwayat absensi di kelas Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {attendance.map((log) => {
        const isHadir = log.status.toLowerCase() === "hadir";
        return (
          <div
            key={log.id}
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between group hover:border-orange-200 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
              <div
                className={`p-3 rounded-xl shrink-0 ${isHadir ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
              >
                {isHadir ? <UserCheck size={20} /> : <ShieldAlert size={20} />}
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {log.profiles?.full_name || "Siswa Tidak Diketahui"}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-medium text-slate-400">
                  <span className="truncate max-w-30 sm:max-w-50">
                    {log.schedules?.title || "Kegiatan Umum"}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock size={12} className="text-orange-400" />
                    {format(new Date(log.scan_time), "dd MMM yyyy, HH:mm", {
                      locale: id,
                    })}
                  </span>
                </div>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`shrink-0 text-[9px] uppercase font-black tracking-widest ${
                isHadir
                  ? "bg-green-50 text-green-600 border-green-200"
                  : log.status === "terlambat"
                    ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                    : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              {log.status}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}
