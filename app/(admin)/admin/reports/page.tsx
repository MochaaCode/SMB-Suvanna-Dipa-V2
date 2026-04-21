import { Metadata } from "next";
import { getYearlyRecapData } from "@/actions/admin/reports";
import { ReportsManagement } from "@/components/admin/reports/ReportManagementUI";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Laporan Tahunan",
};

export default async function ReportsPage() {
  const data = await getYearlyRecapData();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <ReportsManagement data={data} />
    </div>
  );
}
