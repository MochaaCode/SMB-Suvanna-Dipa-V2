/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Gift,
  PartyPopper,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/dashboard/MetricCard";
import { RecentActivityList } from "./RecentActivityList";
import { UpcomingSchedulesList } from "./UpcomingSchedulesList";

interface DashboardData {
  className: string;
  stats: {
    totalStudents: number;
    weeklyAttendance: number;
    birthdaysCount: number;
  };
  birthdays: { id: string; name: string; date: string }[];
  recentLogs: any[];
  upcomingSchedules: any[];
}

export function PembinaDashboardManagement({
  data,
  error,
}: {
  data?: DashboardData;
  error?: string;
}) {
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <PageHeader
        title="Beranda"
        highlightText={data?.className || "Pembina"}
        subtitle="Pantau aktivitas siswa, kehadiran, dan momen spesial di kelas Anda."
        icon={<LayoutDashboard size={24} />}
        themeColor="orange"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          title="Siswa Binaan"
          value={data?.stats?.totalStudents ?? 0}
          icon={<Users size={28} />}
          theme="blue"
        />
        <MetricCard
          title="Hadir Minggu Ini"
          value={data?.stats?.weeklyAttendance ?? 0}
          icon={<CheckSquare size={28} />}
          theme="green"
        />
        <MetricCard
          title="Ultah 7 Hari Kedepan"
          value={data?.stats?.birthdaysCount ?? 0}
          icon={<Gift size={28} />}
          theme="purple"
        />
      </div>

      {data?.birthdays && data.birthdays.length > 0 && (
        <div className="bg-linear-to-r from-purple-500 to-fuchsia-600 rounded-[1.5rem] p-5 md:p-6 text-white shadow-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <PartyPopper size={28} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-lg">Momen Spesial Minggu Ini!</h3>
              <p className="text-sm font-medium text-purple-100 opacity-90 mt-0.5">
                Jangan lupa beri selamat untuk:{" "}
                <span className="font-bold text-white">
                  {data.birthdays.map((b) => b.name).join(", ")}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <RecentActivityList logs={data?.recentLogs || []} />
        <UpcomingSchedulesList schedules={data?.upcomingSchedules || []} />
      </div>
    </div>
  );
}
