"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { LayoutDashboard, Users, CheckSquare, Award } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/dashboard/MetricCard";
import { RecentActivityList } from "./RecentActivityList";
import { UpcomingSchedulesList } from "./UpcomingSchedulesList";

// UPDATE INTERFACE SESUAI SERVER ACTION
interface DashboardData {
  stats: {
    totalStudents: number;
    todayAttendance: number;
    pointsDistributed: number;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentLogs: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  upcomingSchedules: any[];
}

interface PembinaDashboardManagementProps {
  data?: DashboardData;
  error?: string;
}

export function PembinaDashboardManagement({
  data,
  error,
}: PembinaDashboardManagementProps) {
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <PageHeader
        title="Beranda"
        highlightText="Pembina"
        subtitle="Pantau aktivitas kelas, kehadiran, dan distribusi poin motivasi."
        icon={<LayoutDashboard size={24} />}
        themeColor="orange"
      />

      {/* GRID STATISTIK YANG SUDAH DI-REFACTOR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          title="Total Siswa Aktif"
          value={data?.stats?.totalStudents ?? 0}
          icon={<Users size={28} />}
          theme="blue"
        />
        <MetricCard
          title="Absen Hari Ini"
          value={data?.stats?.todayAttendance ?? 0}
          icon={<CheckSquare size={28} />}
          theme="green"
        />
        <MetricCard
          title="Poin Didistribusi"
          value={data?.stats?.pointsDistributed ?? 0}
          icon={<Award size={28} />}
          theme="orange"
        />
      </div>

      {/* DUA KOTAK LIST ACTIVITY & SCHEDULE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <RecentActivityList logs={data?.recentLogs || []} />
        <UpcomingSchedulesList schedules={data?.upcomingSchedules || []} />
      </div>
    </div>
  );
}
