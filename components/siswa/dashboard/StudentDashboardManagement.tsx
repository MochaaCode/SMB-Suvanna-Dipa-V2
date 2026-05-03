"use client";

import { Sparkles, CalendarCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MetricCard } from "@/components/shared/dashboard/MetricCard";

import { VirtualMemberCard } from "./VirtualMemberCard";
import { OrderTracker } from "./OrderTracker";
import { UpcomingAgenda } from "./UpcomingAgenda";
import { UpcomingMaterial } from "./UpcomingMaterial";
import { RecentActivityLog } from "./RecentActivityLog";
import type { DashboardStats } from "@/actions/siswa/dashboard";

interface StudentDashboardManagementProps {
  data: DashboardStats;
}

export function StudentDashboardManagement({
  data,
}: StudentDashboardManagementProps) {
  return (
    <div className="w-full space-y-8 pb-10 animate-in fade-in duration-700">
      <PageHeader
        title="DASBOR"
        highlightText=""
        subtitle={
          <>
            Namo Buddhaya,{" "}
            <span className="text-orange-600 font-bold">
              {data.studentInfo.fullName.split(" ")[0]}
            </span>.
          </>
        }
        icon={<Sparkles className="text-orange-500" size={24} />}
        themeColor="orange"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-1 lg:col-span-2">
          <VirtualMemberCard
            studentInfo={data.studentInfo}
            className={data.className}
            points={data.points}
          />
        </div>
        <div className="md:col-span-1 lg:col-span-1 flex flex-col justify-end">
          <MetricCard
            title="Total Kehadiran"
            value={`${data.totalAttendance}x`}
            icon={<CalendarCheck size={24} />}
            theme="green"
            description="Terhitung selama tahun ajaran ini"
          />
        </div>
      </div>

      <OrderTracker activeOrders={data.activeOrders} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <UpcomingAgenda schedule={data.upcomingSchedule} />
        <UpcomingMaterial material={data.upcomingMaterial} />
      </div>

      <RecentActivityLog activities={data.recentActivities} />
    </div>
  );
}
