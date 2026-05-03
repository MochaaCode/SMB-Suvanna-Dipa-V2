"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { History, Package, Coins, CalendarCheck } from "lucide-react";
import { OrderHistoryTab } from "./OrderHistoryTab";
import { PointHistoryTab } from "./PointHistoryTab";
import { AttendanceHistoryTab } from "./AttendanceHistoryTab";
import type { ActivityData } from "@/actions/siswa/activity";

export function StudentActivityManagement({ data }: { data: ActivityData }) {
  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-700">
      <PageHeader
        title="AKTIVITAS"
        highlightText="SAYA"
        subtitle="Pantau riwayat kehadiran, poin, dan penukaran hadiah Anda di sini."
        icon={<History size={24} />}
        themeColor="orange"
      />

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="flex w-full bg-slate-100 px-2 py-8 rounded-[1rem] h-auto mb-8 shadow-sm border border-slate-200">
          <TabsTrigger
            value="orders"
            className="flex-1 rounded-[0.8rem] font-bold text-[11px] flex flex-col gap-1.5 py-6 transition-all data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm"
          >
            <Package size={18} />
            <span>Pesanan</span>
          </TabsTrigger>

          <TabsTrigger
            value="points"
            className="flex-1 rounded-[0.8rem] font-bold text-[11px] flex flex-col gap-1.5 py-6 transition-all data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm"
          >
            <Coins size={18} />
            <span>Mutasi Poin</span>
          </TabsTrigger>

          <TabsTrigger
            value="attendance"
            className="flex-1 rounded-[0.8rem] font-bold text-[11px] flex flex-col gap-1.5 py-6 transition-all data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm"
          >
            <CalendarCheck size={18} />
            <span>Presensi</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-2">
          <TabsContent
            value="orders"
            className="m-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <OrderHistoryTab orders={data.orders} />
          </TabsContent>

          <TabsContent
            value="points"
            className="m-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <PointHistoryTab points={data.points} />
          </TabsContent>

          <TabsContent
            value="attendance"
            className="m-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <AttendanceHistoryTab attendance={data.attendance} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
