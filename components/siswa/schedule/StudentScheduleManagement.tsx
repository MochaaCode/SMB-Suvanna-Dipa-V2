"use client";

import { useState } from "react";
import {
  CalendarDays,
  Sparkles,
  Search,
  Megaphone,
  BookOpen,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppCard } from "@/components/shared/AppCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduleList } from "./ScheduleList";
import type { StudentScheduleItem } from "@/actions/siswa/schedules";
import { useSearchParams } from "next/navigation";

interface StudentScheduleManagementProps {
  schedules: StudentScheduleItem[];
}

export function StudentScheduleManagement({
  schedules,
}: StudentScheduleManagementProps) {
  const safeSchedules = schedules || [];
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");
  const defaultTab = tabParam === "materi" ? "materi" : "pengumuman";

  const announcements = safeSchedules.filter((s) => s.is_announcement);
  const materials = safeSchedules.filter((s) => !s.is_announcement);

  return (
    <div className="w-full space-y-8 pb-20 animate-in fade-in duration-700">
      <PageHeader
        title="AGENDA &"
        highlightText="JADWAL"
        subtitle="Informasi lengkap mengenai jadwal kelas dan kegiatan mendatang."
        icon={<CalendarDays className="text-orange-500" size={24} />}
        themeColor="orange"
      />

      <div className="flex flex-col md:flex-row gap-5">
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

        <div className="w-full md:w-2/3">
          <AppCard className="p-2 bg-white border-slate-200 shadow-sm rounded-[1.5rem] h-full flex flex-col justify-center">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <Input
                placeholder="Cari nama agenda atau materi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-slate-50 border-transparent rounded-[1rem] focus-visible:ring-orange-500 font-bold text-sm"
              />
            </div>
          </AppCard>
        </div>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-[1rem] h-auto mb-6 w-full md:w-auto">
          <TabsTrigger
            value="pengumuman"
            className="flex-1 md:flex-none gap-2 text-xs font-bold px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm rounded-[0.8rem] transition-all"
          >
            <Megaphone size={14} />
            Pengumuman
            <span className="ml-1 text-[9px] font-black bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">
              {announcements.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="materi"
            className="flex-1 md:flex-none gap-2 text-xs font-bold px-5 py-2.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-[0.8rem] transition-all"
          >
            <BookOpen size={14} />
            Materi Belajar
            <span className="ml-1 text-[9px] font-black bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
              {materials.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pengumuman" className="m-0">
          <ScheduleList
            schedules={announcements}
            searchQuery={searchQuery}
            emptyMessage="Belum ada pengumuman aktif."
          />
        </TabsContent>

        <TabsContent value="materi" className="m-0">
          <ScheduleList
            schedules={materials}
            searchQuery={searchQuery}
            emptyMessage="Belum ada jadwal materi belajar."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
