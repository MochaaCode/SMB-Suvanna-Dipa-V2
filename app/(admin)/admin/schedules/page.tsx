import { Metadata } from "next";
import { getSchedules } from "@/actions/admin/schedules";
import { getClassesWithDetails } from "@/actions/admin/classes";

import { ScheduleManagementUI } from "@/components/admin/schedules/ScheduleManagementUI";

export const metadata: Metadata = {
  title: "Manajemen Jadwal Kegiatan",
  description: "Kelola jadwal kegiatan dan pelajaran di SMB",
};

export default async function SchedulesPage() {
  const [schedules, classes] = await Promise.all([
    getSchedules(),
    getClassesWithDetails(),
  ]);

  return (
    // Wrapper <main> dihapus agar konsisten dengan Layout global
    <ScheduleManagementUI initialSchedules={schedules} classes={classes} />
  );
}
