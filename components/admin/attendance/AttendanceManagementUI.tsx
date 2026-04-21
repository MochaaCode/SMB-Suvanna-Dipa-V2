"use client";

import AttendanceHeader from "./AttendanceHeader";
import AttendanceStatsCards from "./AttendanceStatsCards";
import AttendanceTableCard from "./AttendanceTableCard";

// IMPORT TIPE KETAT
import type { Schedule, AttendanceLogWithProfile } from "@/types";

interface AttendanceManagementUIProps {
  activeSchedule: Schedule;
  initialLogs: AttendanceLogWithProfile[];
  stats: { hadir: number; terlambat: number; totalScan: number };
}

export function AttendanceManagementUI({
  activeSchedule,
  initialLogs,
  stats,
}: AttendanceManagementUIProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* 1. HEADER KONTROL */}
      <AttendanceHeader schedule={activeSchedule} />

      {/* 2. STATISTIK ANGKA LIVE */}
      <AttendanceStatsCards stats={stats} />

      {/* 3. TABEL LOG RFID */}
      <AttendanceTableCard
        initialLogs={initialLogs}
        scheduleId={activeSchedule.id}
      />
    </div>
  );
}
