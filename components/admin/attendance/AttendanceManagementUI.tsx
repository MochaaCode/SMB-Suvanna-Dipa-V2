"use client";

import { useState } from "react";
import AttendanceHeader from "./AttendanceHeader";
import AttendanceStatsCards from "./AttendanceStatsCards";
import AttendanceTableCard from "./AttendanceTableCard";
import ManualAttendanceModal from "./ManualAttendanceModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";

import type {
  ScheduleWithClasses,
  AttendanceLogWithProfile,
  Profile,
} from "@/types";

interface SessionData {
  schedule: ScheduleWithClasses;
  logs: AttendanceLogWithProfile[];
  stats: { hadir: number; terlambat: number; totalScan: number };
  eligibleStudents: Profile[];
}

interface AttendanceManagementUIProps {
  sessions: SessionData[];
}

function SingleSessionView({ session }: { session: SessionData }) {
  const [isManualOpen, setIsManualOpen] = useState(false);

  return (
    <div className="space-y-6">
      <AttendanceHeader
        schedule={session.schedule}
        onOpenManual={() => setIsManualOpen(true)}
      />

      <AttendanceStatsCards stats={session.stats} />

      <AttendanceTableCard
        initialLogs={session.logs}
        scheduleId={session.schedule.id}
      />

      <ManualAttendanceModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        scheduleId={session.schedule.id}
        eligibleStudents={session.eligibleStudents}
      />
    </div>
  );
}

export function AttendanceManagementUI({
  sessions,
}: AttendanceManagementUIProps) {
  if (sessions.length === 1) {
    return (
      <div className="animate-in fade-in duration-700">
        <SingleSessionView session={sessions[0]} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <Tabs defaultValue={String(sessions[0].schedule.id)} className="w-full">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen size={16} className="text-orange-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {sessions.length} Sesi Aktif Berlangsung
          </h2>
          <div className="h-px bg-slate-200 grow" />
        </div>

        <TabsList className="bg-slate-100 p-1 rounded-[1rem] h-auto flex flex-wrap gap-1 mb-6">
          {sessions.map(({ schedule }) => (
            <TabsTrigger
              key={schedule.id}
              value={String(schedule.id)}
              className="text-xs font-bold px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm rounded-[0.8rem] transition-all"
            >
              {schedule.title}
              {schedule.class_id && (
                <span className="ml-1.5 text-[9px] font-bold opacity-60 uppercase">
                  · Kelas {schedule.classes?.name || "Tanpa Nama"}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {sessions.map((session) => (
          <TabsContent
            key={session.schedule.id}
            value={String(session.schedule.id)}
            className="m-0"
          >
            <SingleSessionView session={session} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
