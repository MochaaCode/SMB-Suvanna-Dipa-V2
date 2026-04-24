import { Metadata } from "next";
import { getAvailableProducts } from "@/actions/siswa/store";
import { getStudentDashboardStats } from "@/actions/siswa/dashboard";
import { StoreManagement } from "@/components/siswa/store/StoreManagement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Katalog Hadiah",
};

export default async function StorePage() {
  const [products, stats] = await Promise.all([
    getAvailableProducts(),
    getStudentDashboardStats(),
  ]);

  return <StoreManagement products={products} userPoints={stats.points} />;
}
