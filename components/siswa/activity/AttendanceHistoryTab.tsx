/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Clock, CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { AttendanceLogWithProfile } from "@/types";

export function AttendanceHistoryTab({
  attendance,
}: {
  attendance: AttendanceLogWithProfile[];
}) {
  if (attendance.length === 0)
    return <EmptyState message="Belum ada riwayat kehadiran." />;

  return (
    <div className="space-y-3">
      {attendance.map((log) => (
        <div
          key={log.id}
          className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between"
        >
          <div className="flex flex-col gap-1">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {(log as any).schedules?.title || "Kegiatan Umum"}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
              <Clock size={12} />{" "}
              {format(new Date(log.scan_time), "dd MMM yyyy, HH:mm", {
                locale: id,
              })}
            </div>
          </div>
          <Badge
            variant="outline"
            className={`text-[9px] uppercase font-black ${
              log.status === "hadir"
                ? "bg-green-50 text-green-600 border-green-200"
                : log.status === "terlambat"
                  ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                  : "bg-red-50 text-red-600 border-red-200"
            }`}
          >
            {log.status}
          </Badge>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-20 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
      <CalendarCheck className="mx-auto text-slate-300 mb-3" size={40} />
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-10">
        {message}
      </p>
    </div>
  );
}
