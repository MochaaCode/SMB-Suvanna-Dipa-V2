"use client";

import { AppModal } from "../../shared/AppModal";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, BookOpen, Megaphone } from "lucide-react";

import type { ScheduleWithRelations } from "@/actions/admin/schedules";

interface ViewScheduleModalProps {
  schedule: ScheduleWithRelations | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewScheduleModal({
  schedule,
  isOpen,
  onClose,
}: ViewScheduleModalProps) {
  if (!schedule) return null;

  const isAnnouncement = schedule.is_announcement;

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={schedule.title}
      variant={isAnnouncement ? "blue" : "orange"}
      maxWidth="2xl"
    >
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-[1rem] border border-slate-200 shadow-sm mb-6">
        <Badge
          className={`${
            isAnnouncement
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : "bg-orange-50 text-orange-700 border-orange-200"
          } px-3 py-1 rounded-[1rem] font-bold uppercase tracking-wider text-[10px] shadow-none flex items-center gap-1.5`}
        >
          {isAnnouncement ? <Megaphone size={12} /> : <BookOpen size={12} />}
          {isAnnouncement ? "Pengumuman" : "Materi"}
        </Badge>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <Calendar
            size={14}
            className={isAnnouncement ? "text-blue-500" : "text-orange-500"}
          />
          {new Date(schedule.event_date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <User
            size={14}
            className={isAnnouncement ? "text-blue-500" : "text-orange-500"}
          />
          Oleh: {schedule.author?.full_name || "Admin"}
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-[1rem] border border-slate-200 shadow-sm min-h-75 text-left">
        <div
          className={`prose prose-sm sm:prose-base max-w-none 
            prose-headings:font-bold prose-headings:text-slate-800
            prose-p:text-slate-600 prose-p:leading-relaxed
            prose-li:text-slate-600 ${isAnnouncement ? "prose-a:text-blue-600" : "prose-a:text-orange-600"} prose-a:font-semibold hover:prose-a:underline`}
          dangerouslySetInnerHTML={{ __html: schedule.content as string }}
        />
      </div>
    </AppModal>
  );
}
