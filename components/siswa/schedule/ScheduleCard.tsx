"use client";

import {
  Clock,
  MapPin,
  ChevronRight,
  Megaphone,
  CalendarDays,
} from "lucide-react";
import { AppCard } from "@/components/shared/AppCard";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { StudentScheduleItem } from "@/actions/student/schedules";

interface ScheduleCardProps {
  schedule: StudentScheduleItem;
  onClick: () => void;
}

export function ScheduleCard({ schedule, onClick }: ScheduleCardProps) {
  const isGlobal = schedule.is_announcement || !schedule.class;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="block h-full cursor-pointer outline-none"
    >
      <AppCard className="p-0 border-slate-200 overflow-hidden flex flex-row h-full hover:border-orange-300 hover:shadow-lg transition-all group rounded-[1.5rem] bg-white">
        <div
          className={cn(
            "p-4 w-24 flex flex-col items-center justify-center border-r border-dashed transition-colors",
            isGlobal
              ? "bg-orange-500 text-white border-orange-400 group-hover:bg-orange-600"
              : "bg-slate-50 text-slate-500 border-slate-200 group-hover:bg-slate-100",
          )}
        >
          {isGlobal ? (
            <Megaphone size={18} className="mb-2 opacity-80" />
          ) : (
            <CalendarDays size={18} className="mb-2 opacity-60" />
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

        <div className="p-5 flex-1 flex flex-col justify-between relative">
          <ChevronRight
            size={20}
            className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"
          />

          <div className="space-y-2 pr-8">
            <h4 className="font-black text-base text-slate-800 leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
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
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-600">
              <Clock size={14} />
              {format(new Date(schedule.event_date), "HH:mm")} WIB
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <MapPin size={12} />
              Vihara
            </div>
          </div>
        </div>
      </AppCard>
    </div>
  );
}
