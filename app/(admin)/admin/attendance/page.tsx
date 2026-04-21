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
  const activeSchedule = await getSchedules().then((schedules) =>
    schedules.find((s) => s.is_active && !s.is_deleted),
  );

  if (!activeSchedule) {
    return <AttendanceEmptyState />;
  }

  const [initialLogs, stats, eligibleStudents] = await Promise.all([
    getTodayAttendanceLogs(activeSchedule.id),
    getAttendanceStats(activeSchedule.id),
    getEligibleStudents(activeSchedule.class_id),
  ]);

  return (
    <AttendanceManagementUI
      activeSchedule={activeSchedule}
      initialLogs={initialLogs}
      stats={stats}
      eligibleStudents={eligibleStudents}
    />
  );
}
