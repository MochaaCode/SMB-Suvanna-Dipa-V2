"use client";

import { useState } from "react";
import { YearlyRecapData } from "@/actions/admin/reports";
import { exportToExcel } from "@/lib/export";
import {
  Download,
  Users,
  Award,
  TrendingUp,
  Search,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { AppCard } from "../../shared/AppCard";
import { AppButton } from "../../shared/AppButton";
import { PageHeader } from "../../shared/PageHeader";
import { ReportMetricCard } from "./ReportMetricCard";
import { ReportsTable } from "./ReportTable";

export function ReportsManagement({ data }: { data: YearlyRecapData[] }) {
  const [search, setSearch] = useState("");

  // 1. Logic Pencarian
  const filteredData = data.filter((item) =>
    item["Nama Lengkap"].toLowerCase().includes(search.toLowerCase()),
  );

  // 2. Logic Kalkulasi Metrik
  const totalStudents = data.length;
  const activeStudents = data.filter(
    (dataStatus) => dataStatus["Status Keaktifan"] === "Aktif",
  ).length;
  const totalPoints = data.reduce((acc, curr) => acc + curr["Total Poin"], 0);
  const avgAttendance = totalStudents
    ? (
        data.reduce((acc, curr) => acc + curr["Total Hadir"], 0) / totalStudents
      ).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      {/* MENGGUNAKAN PAGE HEADER BAWAAN LU */}
      <PageHeader
        title="Audit &"
        highlightText="Laporan"
        subtitle="Rekapitulasi performa dan kehadiran tahunan"
        icon={<FileSpreadsheet size={24} />}
        themeColor="orange"
        rightContent={
          <AppButton
            onClick={() =>
              exportToExcel(data, "Laporan_Tutup_Buku_SMB", "Rekap Tahunan")
            }
            leftIcon={<Download size={18} />}
          >
            Export ke Excel
          </AppButton>
        }
      />

      {/* RENDER KOMPONEN METRIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportMetricCard
          title="Total Siswa"
          value={totalStudents}
          icon={<Users />}
          theme="blue"
        />
        <ReportMetricCard
          title="Siswa Aktif"
          value={activeStudents}
          icon={<TrendingUp />}
          theme="green"
        />
        <ReportMetricCard
          title="Total Poin"
          value={totalPoints}
          icon={<Award />}
          theme="orange"
        />
        <ReportMetricCard
          title="Rata-rata Hadir"
          value={`${avgAttendance}x`}
          icon={<AlertCircle />}
          theme="purple"
        />
      </div>

      {/* RENDER KOMPONEN TABEL */}
      <AppCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center bg-slate-50/50">
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              placeholder="Cari nama siswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white border-slate-200 focus-visible:ring-orange-500"
            />
          </div>
        </div>

        <ReportsTable data={filteredData} />
      </AppCard>
    </div>
  );
}
