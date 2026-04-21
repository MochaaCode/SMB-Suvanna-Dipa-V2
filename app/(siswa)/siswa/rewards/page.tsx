import { Metadata } from "next";
import { getAvailableProducts } from "@/actions/student/rewards";
import { getStudentDashboardStats } from "@/actions/student/dashboard";
import { RewardShopManagement } from "@/components/siswa/rewards/RewardShopManagement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Toko Hadiah",
};

export default async function RewardShopPage() {
  // Ambil data secara paralel biar ngebut
  const [products, stats] = await Promise.all([
    getAvailableProducts(),
    getStudentDashboardStats(),
  ]);

  return <RewardShopManagement products={products} userPoints={stats.points} />;
}
