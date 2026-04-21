"use client";

import { Clock, UserCheck, ShieldAlert } from "lucide-react";
import { AppCard } from "@/components/shared/AppCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RecentActivityList({ logs }: { logs: any[] }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="h-64 border-2 border-dashed border-slate-200 rounded-[1rem] flex items-center justify-center text-slate-400 text-sm font-medium italic">
        Belum ada aktivitas absensi hari ini.
      </div>
    );
  }

  return (
    <AppCard className="p-0 overflow-hidden border-slate-100 flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Clock size={18} className="text-blue-500" />
          Aktivitas Absensi Terbaru
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-4 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-4 border-b border-slate-50 last:border-0"
          >
            <div
              className={`p-2.5 rounded-full ${log.status.toLowerCase() === "hadir" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
            >
              {log.status.toLowerCase() === "hadir" ? (
                <UserCheck size={18} />
              ) : (
                <ShieldAlert size={18} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-slate-800 truncate">
                {log.profiles?.full_name}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {log.schedules?.title}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-slate-600">
                {new Date(log.scan_time).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">
                {log.method}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AppCard>
  );
}
