"use client";

import { useState } from "react";
import AttendanceHeader from "./AttendanceHeader";
import AttendanceStatsCards from "./AttendanceStatsCards";
import AttendanceTableCard from "./AttendanceTableCard";
import ManualAttendanceModal from "./ManualAttendanceModal";

import type { Schedule, AttendanceLogWithProfile, Profile } from "@/types";

interface AttendanceManagementUIProps {
  activeSchedule: Schedule;
  initialLogs: AttendanceLogWithProfile[];
  stats: { hadir: number; terlambat: number; totalScan: number };
  eligibleStudents: Profile[];
}

export function AttendanceManagementUI({
  activeSchedule,
  initialLogs,
  stats,
  eligibleStudents,
}: AttendanceManagementUIProps) {
  const [isManualOpen, setIsManualOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <AttendanceHeader
        schedule={activeSchedule}
        onOpenManual={() => setIsManualOpen(true)}
      />

      <AttendanceStatsCards stats={stats} />

      <AttendanceTableCard
        initialLogs={initialLogs}
        scheduleId={activeSchedule.id}
      />

      <ManualAttendanceModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        scheduleId={activeSchedule.id}
        eligibleStudents={eligibleStudents}
      />
    </div>
  );
}
