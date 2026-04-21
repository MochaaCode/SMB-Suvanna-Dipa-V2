import { Metadata } from "next";
import { getMyAttendanceHistory } from "@/actions/student/attendance";
import { StudentAttendanceManagement } from "@/components/siswa/attendance/StudentAttendanceManagement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Riwayat Absensi",
};

export default async function AttendancePage() {
  const logs = await getMyAttendanceHistory();

  return <StudentAttendanceManagement logs={logs} />;
}
