import { Metadata } from "next";
import { getStudentActivityData } from "@/actions/student/activity";
import { StudentActivityManagement } from "@/components/siswa/activity/StudentActivityManagement";

export const metadata: Metadata = {
  title: "Aktivitas Saya",
  description: "Riwayat presensi, poin, dan pesanan hadiah siswa.",
};

export default async function ActivityPage() {
  const data = await getStudentActivityData();
  return <StudentActivityManagement data={data} />;
}
