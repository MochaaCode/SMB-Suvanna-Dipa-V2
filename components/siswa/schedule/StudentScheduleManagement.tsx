"use client";

import { useState } from "react";
import { CalendarDays, Sparkles, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppCard } from "@/components/shared/AppCard";
import { Input } from "@/components/ui/input";
import { ScheduleList } from "./ScheduleList";
import type { StudentScheduleItem } from "@/actions/student/schedules";

interface StudentScheduleManagementProps {
  schedules: StudentScheduleItem[];
}

export function StudentScheduleManagement({
  schedules,
}: StudentScheduleManagementProps) {
  const safeSchedules = schedules || [];
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full space-y-8 pb-20 animate-in fade-in duration-700">
      <PageHeader
        title="AGENDA &"
        highlightText="JADWAL"
        subtitle="Informasi lengkap mengenai jadwal kelas dan kegiatan mendatang."
        icon={<CalendarDays className="text-orange-500" size={24} />}
        themeColor="orange"
      />

      {/* FIX DESKTOP LAYOUT: Bersanding Elegan Kiri-Kanan */}
      <div className="flex flex-col md:flex-row gap-5">
        {/* Kolom Kiri: Stat Card (Lebar 1/3 di Desktop) */}
        <div className="w-full md:w-1/3 p-6 bg-linear-to-br from-orange-500 to-amber-500 rounded-[1.5rem] text-white flex items-center justify-between overflow-hidden relative shadow-[0_8px_30px_rgb(234,88,12,0.25)]">
          <Sparkles
            size={100}
            className="absolute -right-6 -bottom-6 opacity-20 rotate-12"
          />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90 drop-shadow-sm">
              Total Agenda Aktif
            </p>
            <p className="text-4xl font-black leading-none mt-2 drop-shadow-md">
              {safeSchedules.length}{" "}
              <span className="text-sm font-bold opacity-80 tracking-widest uppercase">
                Kegiatan
              </span>
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Search Bar (Lebar 2/3 di Desktop) */}
        <div className="w-full md:w-2/3">
          <AppCard className="p-2 bg-white border-slate-200 shadow-sm rounded-[1.5rem] h-full flex flex-col justify-center">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <Input
                placeholder="Cari nama agenda atau pengumuman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-slate-50 border-transparent rounded-[1rem] focus-visible:ring-orange-500 font-bold text-sm"
              />
            </div>
          </AppCard>
        </div>
      </div>

      {/* List Komponen merender grid dan Modal */}
      <ScheduleList schedules={safeSchedules} searchQuery={searchQuery} />
    </div>
  );
}
