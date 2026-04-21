import { Metadata } from "next";
import { getStudentSchedules } from "@/actions/student/schedules";
import { StudentScheduleManagement } from "@/components/siswa/schedule/StudentScheduleManagement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jadwal Kegiatan",
};

export default async function SchedulePage() {
  const schedules = await getStudentSchedules();

  return <StudentScheduleManagement schedules={schedules} />;
}
