import { Metadata } from "next";
import { getStudentDashboardStats } from "@/actions/siswa/dashboard";
import { StudentDashboardManagement } from "@/components/siswa/dashboard/StudentDashboardManagement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard Siswa",
};

export default async function StudentDashboardPage() {
  const dashboardData = await getStudentDashboardStats();

  return <StudentDashboardManagement data={dashboardData} />;
}
