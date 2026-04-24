"use client";

import { History, Coins, CalendarCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PembinaAttendanceTab } from "./PembinaAttendanceTab";
import { PembinaPointTab } from "./PembinaPointTab";
import type { PembinaLogsData } from "@/actions/pembina/logs";

export function PembinaLogsManagement({ data }: { data: PembinaLogsData }) {
  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-700">
      <PageHeader
        title="RIWAYAT"
        highlightText="AKTIVITAS"
        subtitle="Pantau log presensi dan mutasi poin khusus siswa di kelas Anda."
        icon={<History size={24} />}
        themeColor="orange"
      />

      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="flex w-full bg-slate-100 px-2 py-8 rounded-[1rem] h-auto shadow-sm border border-slate-200">
          <TabsTrigger
            value="attendance"
            className="flex-1 rounded-[0.8rem] font-bold text-[11px] flex flex-col gap-1.5 py-6 transition-all data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm"
          >
            <CalendarCheck size={18} />
            <span>Presensi Siswa</span>
          </TabsTrigger>

          <TabsTrigger
            value="points"
            className="flex-1 rounded-[0.8rem] font-bold text-[11px] flex flex-col gap-1.5 py-6 transition-all data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm"
          >
            <Coins size={18} />
            <span>Mutasi Poin</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-2">
          <TabsContent
            value="attendance"
            className="m-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <PembinaAttendanceTab attendance={data.attendance} />
          </TabsContent>

          <TabsContent
            value="points"
            className="m-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <PembinaPointTab points={data.points} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
