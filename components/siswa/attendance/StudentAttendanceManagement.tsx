"use client";

import { CalendarCheck, MapPin, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppCard } from "@/components/shared/AppCard";
import { Input } from "@/components/ui/input";
import { AttendanceLogCard, type AttendanceLog } from "./AttendanceLogCard";

interface StudentAttendanceManagementProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logs: AttendanceLog[] | any;
}

export function StudentAttendanceManagement({
  logs,
}: StudentAttendanceManagementProps) {
  const safeLogs = (logs || []) as AttendanceLog[];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <PageHeader
        title="Riwayat"
        highlightText="Absensi"
        subtitle="Pantau catatan kehadiranmu pada setiap kegiatan kelas."
        icon={<CalendarCheck size={24} />}
        themeColor="green"
      />

      {/* FILTER AREA */}
      <AppCard className="p-4 md:p-4 bg-slate-50/50 border-slate-200">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Cari nama kegiatan..."
            className="pl-10 h-11 bg-white border-slate-200 focus-visible:ring-green-500"
          />
        </div>
      </AppCard>

      {/* LIST ABSENSI */}
      <div className="space-y-4">
        {safeLogs.length > 0 ? (
          safeLogs.map((log) => <AttendanceLogCard key={log.id} log={log} />)
        ) : (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-dashed border-slate-200">
            <MapPin size={48} className="mx-auto text-slate-200" />
            <p className="text-slate-500 font-medium italic">
              Kamu belum memiliki catatan absensi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
