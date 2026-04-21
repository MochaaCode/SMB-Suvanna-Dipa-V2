import { Metadata } from "next";
import { getPembinaDashboardStats } from "@/actions/teacher/dashboard";
import { PembinaDashboardManagement } from "@/components/teacher/dashboard/PembinaDashboardManagement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard Pembina",
};

export default async function PembinaDashboardPage() {
  const stats = await getPembinaDashboardStats();

  return <PembinaDashboardManagement data={stats} />;
}
