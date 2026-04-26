"use client";

import {
  Clock,
  ChevronRight,
  Megaphone,
  CalendarDays,
  BookOpen,
} from "lucide-react";
import { AppCard } from "@/components/shared/AppCard";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { StudentScheduleItem } from "@/actions/siswa/schedules";

interface ScheduleCardProps {
  schedule: StudentScheduleItem;
  onClick: () => void;
}

export function ScheduleCard({ schedule, onClick }: ScheduleCardProps) {
  const isAnnouncement = schedule.is_announcement;
  const isGlobal = isAnnouncement || !schedule.class;

  // Ambil waktu dari kolom start_time DB, bukan dari timestamp event_date
  const displayTime = schedule.start_time
    ? schedule.start_time.substring(0, 5)
    : null;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="block h-full cursor-pointer outline-none"
    >
      <AppCard
        className={cn(
          "p-0 overflow-hidden flex flex-row h-full hover:shadow-lg transition-all group rounded-[1.5rem] bg-white",
          isAnnouncement
            ? "border-slate-200 hover:border-orange-300"
            : "border-slate-200 hover:border-blue-300",
        )}
      >
        {/* Date column */}
        <div
          className={cn(
            "p-4 w-24 flex flex-col items-center justify-center border-r border-dashed transition-colors shrink-0",
            isAnnouncement
              ? "bg-orange-500 text-white border-orange-400 group-hover:bg-orange-600"
              : "bg-blue-500 text-white border-blue-400 group-hover:bg-blue-600",
          )}
        >
          {isAnnouncement ? (
            <Megaphone size={16} className="mb-2 opacity-80" />
          ) : (
            <BookOpen size={16} className="mb-2 opacity-80" />
          )}
          <p className="text-3xl font-black leading-none drop-shadow-sm">
            {new Date(schedule.event_date).getDate()}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest mt-1.5 opacity-90">
            {format(new Date(schedule.event_date), "MMM yyyy", {
              locale: localeID,
            })}
          </p>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between relative">
          <ChevronRight
            size={20}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 right-4 text-slate-300 group-hover:translate-x-1 transition-all",
              isAnnouncement
                ? "group-hover:text-orange-500"
                : "group-hover:text-blue-500",
            )}
          />

          <div className="space-y-2 pr-8">
            {/* Kelas badge */}
            {!isGlobal && schedule.class && (
              <span className="inline-block text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {schedule.class.name}
              </span>
            )}
            <h4
              className={cn(
                "font-black text-base text-slate-800 leading-tight transition-colors line-clamp-2",
                isAnnouncement
                  ? "group-hover:text-orange-600"
                  : "group-hover:text-blue-600",
              )}
            >
              {schedule.title}
            </h4>
            <div
              className="text-xs font-medium text-slate-500 line-clamp-2 prose prose-xs leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: schedule.content || "Tidak ada deskripsi.",
              }}
            />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div
              className={cn(
                "flex items-center gap-1.5 text-[11px] font-bold",
                isAnnouncement ? "text-orange-600" : "text-blue-600",
              )}
            >
              <CalendarDays size={13} />
              {format(new Date(schedule.event_date), "EEEE, dd MMM", {
                locale: localeID,
              })}
            </div>
            {displayTime && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                <Clock size={12} />
                {displayTime} WIB
              </div>
            )}
          </div>
        </div>
      </AppCard>
    </div>
  );
}
