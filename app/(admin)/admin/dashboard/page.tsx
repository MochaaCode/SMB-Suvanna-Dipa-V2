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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dashboardData = await getLiveDashboardData();
  const adminName = user.user_metadata?.full_name?.split(" ")[0] || "Admin";

  return (
    <DashboardUI data={dashboardData} adminName={adminName} />
  );
}
