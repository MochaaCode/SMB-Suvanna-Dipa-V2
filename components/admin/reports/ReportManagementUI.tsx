"use client";

import { useState } from "react";
import { exportMultipleSheetsToExcel } from "@/lib/export";
import {
  Download,
  Users,
  Award,
  Search,
  FileSpreadsheet,
  Activity,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { AppCard } from "../../shared/AppCard";
import { AppButton } from "../../shared/AppButton";
import { PageHeader } from "../../shared/PageHeader";
import { ReportMetricCard } from "./ReportMetricCard";
import { ReportsTable } from "./ReportTable";
import { ReportCharts } from "./ReportCharts";

import type { RichReportData, ChartAnalytics } from "@/actions/admin/reports";

interface ReportsManagementProps {
  data: {
    tableData: RichReportData[];
    analytics: ChartAnalytics;
  };
}

export function ReportsManagement({ data }: ReportsManagementProps) {
  const [search, setSearch] = useState("");

  const filteredData = data.tableData.filter((item) =>
    item["Nama Lengkap"].toLowerCase().includes(search.toLowerCase()),
  );

  const totalStudents = data.tableData.length;
  const activeStudents = data.tableData.filter(
    (d) => d["Status Keaktifan"] !== "Pasif",
  ).length;
  const totalPoints = data.tableData.reduce(
    (acc, curr) => acc + curr["Total Poin"],
    0,
  );

  const handleExport = () => {
    const sheets = [
      { sheetName: "Data Induk Siswa", data: data.tableData },
      { sheetName: "Statistik Kelas", data: data.analytics.classStats },
      { sheetName: "Tren Kehadiran", data: data.analytics.attendanceByMonth },
    ];
    exportMultipleSheetsToExcel(
      sheets,
      `Laporan_Vihara_${new Date().getFullYear()}`,
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit &"
        highlightText="Laporan"
        subtitle="Analitik komprehensif, performa, dan eksport data induk"
        icon={<FileSpreadsheet size={24} />}
        themeColor="orange"
        rightContent={
          <AppButton
            onClick={handleExport}
            leftIcon={<Download size={18} />}
            className="shadow-lg font-bold rounded-[1rem]"
          >
            Unduh Excel Lengkap
          </AppButton>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReportMetricCard
          title="Total Siswa Terdaftar"
          value={totalStudents}
          icon={<Users />}
          theme="blue"
        />
        <ReportMetricCard
          title="Siswa Aktif Hadir"
          value={activeStudents}
          icon={<Activity />}
          theme="green"
        />
        <ReportMetricCard
          title="Total Poin Beredar"
          value={totalPoints.toLocaleString()}
          icon={<Award />}
          theme="orange"
        />
      </div>

      <ReportCharts analytics={data.analytics} />

      <AppCard className="p-0 overflow-hidden shadow-sm border-slate-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <h3 className="text-sm font-bold text-slate-800">Tabel Data Induk</h3>
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <Input
              placeholder="Cari nama siswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 bg-white border-slate-200 rounded-[1rem] focus-visible:ring-orange-500 shadow-sm"
            />
          </div>
        </div>
        <ReportsTable data={filteredData} />
      </AppCard>
    </div>
  );
}
