import { Metadata } from "next";
import { Suspense } from "react";
import { getStudentSchedules } from "@/actions/siswa/schedules";
import { StudentScheduleManagement } from "@/components/siswa/schedule/StudentScheduleManagement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jadwal Kegiatan",
};

export default async function SchedulePage() {
  const schedules = await getStudentSchedules();

  return (
    <Suspense
      fallback={
        <div className="py-20 text-center font-bold text-orange-600">
          Memuat Jadwal...
        </div>
      }
    >
      <StudentScheduleManagement schedules={schedules} />
    </Suspense>
  );
}
