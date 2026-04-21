"use client";

import { Activity, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

import type { AttendanceLogWithProfile, AttendanceStatus } from "@/types";

interface LiveAttendanceCardProps {
  logs: AttendanceLogWithProfile[];
}

export function LiveAttendanceCard({ logs }: LiveAttendanceCardProps) {
  const getStatusBadge = (status: AttendanceStatus) => {
    const base =
      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border";

    switch (status) {
      case "hadir":
        return `${base} bg-green-50 text-green-700 border-green-200`;
      case "terlambat":
        return `${base} bg-yellow-50 text-yellow-700 border-yellow-200`;
      case "alpa":
        return `${base} bg-red-50 text-red-700 border-red-200`;
      case "izin":
        return `${base} bg-blue-50 text-blue-700 border-blue-200`;
      default:
        return `${base} bg-slate-50 text-slate-600 border-slate-200`;
    }
  };

  return (
    <div className="bg-white p-6 rounded-[1rem] border border-slate-200 shadow-sm space-y-5 flex-1 w-full">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-lg text-orange-600 border border-orange-100">
            <Activity size={18} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Kehadiran Terkini
          </h3>
        </div>
        <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200 flex items-center gap-1.5 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          REAL-TIME
        </span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-xs font-medium text-slate-400">
              Belum ada data kehadiran hari ini.
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800 group-hover:text-orange-600 transition-colors">
                  {log.profiles?.full_name || "Siswa Tidak Ditemukan"}
                </p>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Clock size={12} className="text-slate-400" />{" "}
                  {formatDistanceToNow(new Date(log.created_at), {
                    addSuffix: true,
                    locale: id,
                  })}
                </div>
              </div>
              <span className={getStatusBadge(log.status)}>{log.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
