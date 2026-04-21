"use client";

import { Clock, Fingerprint, Info } from "lucide-react";
import { AppCard } from "@/components/shared/AppCard";

// Export interface biar bisa dipakai di komponen induk
export interface AttendanceLog {
  id: number;
  status: string;
  scan_time: string;
  method: string;
  notes: string | null;
  schedules: {
    title: string;
    event_date: string;
  } | null;
}

interface AttendanceLogCardProps {
  log: AttendanceLog;
}

export function AttendanceLogCard({ log }: AttendanceLogCardProps) {
  // Helper untuk warna badge status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "hadir":
        return "bg-green-100 text-green-700 border-green-200";
      case "terlambat":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "izin":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "alpa":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <AppCard className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-green-300 transition-colors">
      <div className="flex flex-col space-y-1">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">
          {log.schedules?.title || "Kegiatan Tanpa Judul"}
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-slate-400" />
            {new Date(log.scan_time).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Fingerprint size={14} className="text-slate-400" />
            Metode: <span className="uppercase">{log.method}</span>
          </span>
        </div>
        {log.notes && (
          <p className="text-xs text-slate-500 mt-2 flex items-start gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
            <span className="italic">Catatan: {log.notes}</span>
          </p>
        )}
      </div>

      {/* BADGE STATUS */}
      <div className="flex shrink-0">
        <span
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border shadow-sm ${getStatusColor(
            log.status,
          )}`}
        >
          {log.status}
        </span>
      </div>
    </AppCard>
  );
}
