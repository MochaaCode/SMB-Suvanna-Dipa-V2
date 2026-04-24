"use client";

import { CalendarDays, Clock, ChevronRight } from "lucide-react";
import { AppCard } from "@/components/shared/AppCard";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import Link from "next/link";
import type { DashboardUpcomingSchedule } from "@/actions/siswa/dashboard";

interface UpcomingAgendaProps {
  schedule: DashboardUpcomingSchedule | null;
}

export function UpcomingAgenda({ schedule }: UpcomingAgendaProps) {
  return (
    <div className="space-y-3 h-full flex flex-col">
      <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">
        Agenda Terdekat
      </h3>
      {schedule ? (
        <Link
          href={`/siswa/schedule?show=${schedule.id}`}
          className="block h-full"
        >
          <AppCard className="p-0 border-slate-200 overflow-hidden flex flex-row h-full hover:border-orange-300 hover:shadow-lg transition-all group rounded-[1.5rem]">
            <div className="bg-orange-500 text-white p-5 md:w-28 flex flex-col items-center justify-center border-r border-orange-400 border-dashed transition-colors group-hover:bg-orange-600">
              <p className="text-4xl font-black leading-none drop-shadow-sm">
                {new Date(schedule.event_date).getDate()}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1.5 opacity-90">
                {format(new Date(schedule.event_date), "MMM", {
                  locale: localeID,
                })}
              </p>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between bg-white relative">
              <ChevronRight
                size={20}
                className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"
              />
              <div className="space-y-2 pr-6">
                <h4 className="font-black text-sm text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">
                  {schedule.title}
                </h4>
                <div
                  className="text-[11px] font-medium text-slate-500 line-clamp-2 prose prose-xs leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: schedule.content || "Tidak ada deskripsi kegiatan.",
                  }}
                />
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] font-bold text-orange-600">
                <Clock size={14} />
                {format(new Date(schedule.event_date), "HH:mm")} WIB
              </div>
            </div>
          </AppCard>
        </Link>
      ) : (
        <AppCard className="p-0 border-slate-200 overflow-hidden flex flex-row h-full rounded-[1.5rem]">
          <div className="bg-slate-100 text-slate-400 p-6 md:w-28 flex flex-col items-center justify-center border-r border-slate-200">
            <CalendarDays size={32} />
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center bg-white text-center">
            <p className="text-[11px] font-bold text-slate-400 italic">
              Belum ada agenda terdekat.
            </p>
          </div>
        </AppCard>
      )}
    </div>
  );
}
