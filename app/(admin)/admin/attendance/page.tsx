import { Metadata } from "next";
import { getSchedules } from "@/actions/admin/schedules";
import {
  getTodayAttendanceLogs,
  getAttendanceStats,
  getEligibleStudents,
} from "@/actions/admin/attendance";

import { AttendanceManagementUI } from "@/components/admin/attendance/AttendanceManagementUI";
import AttendanceEmptyState from "@/components/admin/attendance/AttendanceEmptyState";

export const metadata: Metadata = {
  title: "Manajemen Kehadiran Siswa",
  description: "Monitoring kehadiran siswa secara real-time via RFID & Manual",
};

export default async function AttendancePage() {
  const allSchedules = await getSchedules();
  const activeSchedules = allSchedules.filter(
    (s) => s.is_active && !s.is_deleted,
  );

  if (activeSchedules.length === 0) {
    return <AttendanceEmptyState />;
  }

  const sessionData = await Promise.all(
    activeSchedules.map(async (schedule) => {
      const [logs, stats, eligibleStudents] = await Promise.all([
        getTodayAttendanceLogs(schedule.id),
        getAttendanceStats(schedule.id),
        getEligibleStudents(schedule.class_id),
      ]);
      return { schedule, logs, stats, eligibleStudents };
    }),
  );

  return <AttendanceManagementUI sessions={sessionData} />;
}
