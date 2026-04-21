"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Wallet,
  CalendarCheck,
  ShoppingBag,
  GraduationCap,
  History,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/dashboard/MetricCard";
import { AppCard } from "@/components/shared/AppCard";

interface ActivityLog {
  id: number;
  amount: number;
  type: "earning" | "spending";
  description: string;
  created_at: string;
}

interface ScheduleData {
  title: string;
  event_date: string;
  content: string | null;
}

interface DashboardStats {
  points: number;
  className: string;
  totalAttendance: number;
  pendingOrders: number;
  upcomingSchedule: ScheduleData | null;
  recentActivities: ActivityLog[];
}

interface StudentDashboardManagementProps {
  data?: DashboardStats;
  error?: string;
}

export function StudentDashboardManagement({
  data,
  error,
}: StudentDashboardManagementProps) {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <PageHeader
        title="Beranda"
        highlightText="Siswa"
        subtitle={
          <div className="flex items-center gap-2">
            <GraduationCap size={14} className="text-orange-500" />
            <span>Selamat datang kembali di Portal Belajar SMB</span>
          </div>
        }
        icon={<LayoutDashboard size={24} />}
        themeColor="orange"
      />

      {/* GRID STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Saldo Poin"
          value={data?.points ?? 0}
          icon={<Wallet size={28} />}
          description="Poin tersedia untuk ditukar"
          theme="orange"
        />
        <MetricCard
          title="Total Hadir"
          value={`${data?.totalAttendance ?? 0}x`}
          icon={<CalendarCheck size={28} />}
          description="Kehadiran kamu semester ini"
          theme="green"
        />
        <MetricCard
          title="Pesanan"
          value={data?.pendingOrders ?? 0}
          icon={<ShoppingBag size={28} />}
          description="Hadiah sedang diproses"
          theme="blue"
        />
        <MetricCard
          title="Kelas"
          value={data?.className || "---"}
          icon={<GraduationCap size={28} />}
          description="Kelompok belajar saat ini"
          theme="purple"
        />
      </div>

      {/* WIDGET BAWAH (RIWAYAT & JADWAL) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KOLOM KIRI: RIWAYAT AKTIVITAS (Lebar 2 kolom) */}
        <div className="lg:col-span-2 space-y-6">
          <AppCard className="p-6 flex flex-col h-full border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
                  <History size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                  Riwayat Aktivitas
                </h2>
              </div>
            </div>

            {data?.recentActivities && data.recentActivities.length > 0 ? (
              <div className="space-y-4">
                {data.recentActivities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Ikon Plus/Minus */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          act.type === "earning"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {act.type === "earning" ? (
                          <TrendingUp size={18} />
                        ) : (
                          <TrendingDown size={18} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">
                          {act.description}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(act.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                    {/* Nilai Poin */}
                    <div
                      className={`text-lg font-black shrink-0 ml-4 ${
                        act.type === "earning"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {act.type === "earning" ? "+" : ""}
                      {act.amount}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-10">
                <Sparkles size={40} className="mb-3 opacity-20" />
                <p className="text-sm font-medium italic">
                  Belum ada aktivitas tercatat.
                </p>
              </div>
            )}
          </AppCard>
        </div>

        {/* KOLOM KANAN: JADWAL TERDEKAT (Lebar 1 kolom) */}
        <div className="space-y-6">
          <AppCard className="p-0 overflow-hidden border-0 bg-linear-to-br from-slate-900 to-slate-800 text-white shadow-xl shadow-slate-900/20 relative h-full">
            {/* Efek visual */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="p-6 relative z-10 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6 text-orange-400">
                <CalendarDays size={24} />
                <h2 className="text-lg font-bold tracking-tight text-white">
                  Jadwal Terdekat
                </h2>
              </div>

              {data?.upcomingSchedule ? (
                <div className="flex flex-col flex-1">
                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                      {new Date(
                        data.upcomingSchedule.event_date,
                      ).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="text-2xl font-black leading-tight">
                      {data.upcomingSchedule.title}
                    </h3>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Jam Mulai</span>
                      <span className="font-bold text-orange-400 bg-orange-400/10 px-3 py-1 rounded-lg flex items-center gap-2">
                        <Clock size={14} />
                        {new Date(
                          data.upcomingSchedule.event_date,
                        ).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 py-10">
                  <CalendarDays size={48} className="mb-4 opacity-50" />
                  <p className="text-sm font-medium leading-relaxed">
                    Belum ada jadwal kegiatan <br /> dalam waktu dekat.
                  </p>
                </div>
              )}
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  );
}
