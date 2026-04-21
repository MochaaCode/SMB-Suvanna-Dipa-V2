"use client";

import { LayoutGrid, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";

// IMPORT WIDGETS
import { LiveAttendanceCard } from "./LiveAttendanceCard";
import { PendingOrdersCard } from "./PendingOrdersCard";
import { VisitorChartCard } from "./VisitorChartCard";
import { PointHistoryCard } from "./PointHistoryCard";
import { PasswordResetLogsCard } from "./PasswordResetLogsCard";
import { BirthdayCard } from "./BirthdayCard";

// IMPORT TIPE DATA KETAT
import type {
  ProductOrderWithRelations,
  AttendanceLogWithProfile,
  DailyVisitorStat,
  PasswordResetToken,
  PointHistoryWithProfile,
  Profile,
} from "@/types";

interface DashboardUIProps {
  data: {
    pendingOrders: ProductOrderWithRelations[];
    liveAttendance: AttendanceLogWithProfile[];
    visitorChart: DailyVisitorStat[];
    topPages: { name: string; views: number }[];
    resetLogs: PasswordResetToken[];
    pointHistory: PointHistoryWithProfile[];
    allStudents: Profile[];
  };
  adminName: string;
}

export function DashboardUI({ data, adminName }: DashboardUIProps) {
  // Ambil data kunjungan terakhir untuk informasi di header
  const latestViews =
    data.visitorChart[data.visitorChart.length - 1]?.views || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* HEADER UTAMA */}
      <PageHeader
        title="DASHBOARD"
        highlightText="ADMIN"
        icon={<LayoutGrid size={24} />}
        themeColor="orange"
        subtitle={
          <>
            <Sparkles size={12} className="text-orange-400" />
            Namo Buddhaya,{" "}
            <span className="text-orange-600 font-bold">{adminName}</span>.
            Memantau {data.liveAttendance.length} Kehadiran & {latestViews}{" "}
            Kunjungan Web hari ini.
          </>
        }
      />

      {/* SISTEM GRID OPERASIONAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BARIS 1: Sisi Kritis (Operasional Harian) */}
        <LiveAttendanceCard logs={data.liveAttendance} />
        <PendingOrdersCard orders={data.pendingOrders} />

        {/* BARIS 2: Analitik Trafik (Full Width) */}
        <div className="lg:col-span-2 animate-in slide-in-from-bottom-4 duration-500">
          <VisitorChartCard data={data.visitorChart} topPages={data.topPages} />
        </div>

        {/* BARIS 3: Ekonomi & Keamanan */}
        <PointHistoryCard logs={data.pointHistory} />
        <PasswordResetLogsCard logs={data.resetLogs} />

        {/* BARIS 4: Komunitas & Analitik Demografi (Full Width) */}
        <div className="lg:col-span-2 animate-in slide-in-from-bottom-5 duration-700">
          <BirthdayCard students={data.allStudents} />
        </div>
      </div>
    </div>
  );
}
