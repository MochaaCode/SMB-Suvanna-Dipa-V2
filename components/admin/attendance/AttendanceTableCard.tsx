"use client";

import { History } from "lucide-react";
import AttendanceTable from "./AttendanceTable";
import { AppCard } from "../../shared/AppCard";

import type { AttendanceLogWithProfile } from "@/types";

interface AttendanceTableCardProps {
  initialLogs: AttendanceLogWithProfile[];
  scheduleId: number;
}

export default function AttendanceTableCard({
  initialLogs,
  scheduleId,
}: AttendanceTableCardProps) {
  return (
    <AppCard noPadding className="border-slate-200 shadow-sm">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            <History size={16} className="text-orange-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">
            Log Aktivitas RFID{" "}
            <span className="text-orange-500 font-medium text-xs ml-1">
              (Real-time)
            </span>
          </h2>
        </div>
      </div>
      <div className="p-0">
        <AttendanceTable initialLogs={initialLogs} scheduleId={scheduleId} />
      </div>
    </AppCard>
  );
}
