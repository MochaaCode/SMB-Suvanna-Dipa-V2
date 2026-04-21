"use client";

import { CalendarDays, Search, Inbox } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppCard } from "@/components/shared/AppCard";
import { Input } from "@/components/ui/input";
import { ScheduleCard } from "./ScheduleCard";

interface StudentScheduleManagementProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schedules: any[];
}

export function StudentScheduleManagement({
  schedules,
}: StudentScheduleManagementProps) {
  const safeSchedules = schedules || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Agenda &"
        highlightText="Jadwal"
        subtitle="Informasi lengkap mengenai jadwal kelas dan kegiatan mendatang."
        icon={<CalendarDays size={24} />}
        themeColor="orange"
      />

      <AppCard className="p-4 md:p-4 bg-slate-50/50 border-slate-200">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Cari kegiatan..."
            className="pl-10 h-11 bg-white border-slate-200 focus-visible:ring-orange-500"
          />
        </div>
      </AppCard>

      {safeSchedules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeSchedules.map((sched) => (
            <ScheduleCard key={sched.id} schedule={sched} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center space-y-4 bg-white rounded-[2rem] border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2">
            <Inbox size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">Belum Ada Agenda</h3>
          <p className="text-sm text-slate-500 font-medium italic max-w-sm mx-auto">
            Tidak ada jadwal kelas atau pengumuman dalam waktu dekat. Selamat
            beristirahat!
          </p>
        </div>
      )}
    </div>
  );
}
