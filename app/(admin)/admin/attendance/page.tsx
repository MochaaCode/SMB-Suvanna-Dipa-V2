import { Metadata } from "next";
import { getTodaySchedule } from "@/actions/admin/schedules";
import {
  getTodayAttendanceLogs,
  getAttendanceStats,
} from "@/actions/admin/attendance";

import { AttendanceManagementUI } from "@/components/admin/attendance/AttendanceManagementUI";
import AttendanceEmptyState from "@/components/admin/attendance/AttendanceEmptyState";

export const metadata: Metadata = {
  title: "Manajemen Kehadiran Siswa",
  description: "Monitoring kehadiran siswa secara real-time via RFID",
};

export default async function AttendancePage() {
  // 1. Ambil jadwal aktif hari ini
  const activeSchedule = await getTodaySchedule();

  // 2. Jika tidak ada jadwal yang dibuka, tampilkan Empty State
  if (!activeSchedule) {
    return <AttendanceEmptyState />;
  }

  // 3. Ambil data awal (SSR) untuk logs dan statistik
  const initialLogs = await getTodayAttendanceLogs(activeSchedule.id);
  const stats = await getAttendanceStats(activeSchedule.id);

  return (
    // Panggil ManagementUI layaknya menu lain di aplikasi ini
    <AttendanceManagementUI
      activeSchedule={activeSchedule}
      initialLogs={initialLogs}
      stats={stats}
    />
  );
}
