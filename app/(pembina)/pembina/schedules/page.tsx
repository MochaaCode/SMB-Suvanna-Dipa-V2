import { Metadata } from "next";
import { getPembinaSchedules } from "@/actions/pembina/schedules";
import { PembinaScheduleManagement } from "@/components/teacher/schedules/PembinaScheduleManagement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jadwal Kegiatan | Pembina",
};

export default async function PembinaSchedulesPage() {
  const schedules = await getPembinaSchedules();

  return <PembinaScheduleManagement schedules={schedules} />;
}
