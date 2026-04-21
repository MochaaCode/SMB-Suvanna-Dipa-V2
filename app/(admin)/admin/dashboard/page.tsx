import { Metadata } from "next";
import { getLiveDashboardData } from "@/actions/admin/dashboard";
import { DashboardUI } from "@/components/admin/dashboard/DashboardUI";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Panel kendali administrasi untuk manajemen sistem internal",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Proteksi Rute
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Pengambilan Data Operasional (Parallel Fetching)
  const dashboardData = await getLiveDashboardData();

  // 3. Ekstraksi Identitas Admin
  const adminName = user.user_metadata?.full_name?.split(" ")[0] || "Admin";

  return (
    // Kita hilangkan div pembungkus p-8 max-w-7xl karena sudah ditangani oleh Layout
    <DashboardUI data={dashboardData} adminName={adminName} />
  );
}
