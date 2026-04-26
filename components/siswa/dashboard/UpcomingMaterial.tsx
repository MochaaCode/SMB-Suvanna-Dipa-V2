"use client";

import { BookOpen, Clock, ChevronRight, CalendarDays } from "lucide-react";
import { AppCard } from "@/components/shared/AppCard";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import Link from "next/link";
import type { DashboardUpcomingSchedule } from "@/actions/siswa/dashboard";

interface UpcomingMaterialProps {
  material: DashboardUpcomingSchedule | null;
}

export function UpcomingMaterial({ material }: UpcomingMaterialProps) {
  return (
    <div className="space-y-3 h-full flex flex-col">
      <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">
        Materi Belajar Terdekat
      </h3>
      {material ? (
        <Link
          href={`/siswa/schedule?tab=materi&show=${material.id}`}
          className="block h-full"
        >
          <AppCard className="p-0 border-slate-200 overflow-hidden flex flex-row h-full hover:border-blue-300 hover:shadow-lg transition-all group rounded-[1.5rem]">
            <div className="bg-blue-500 text-white p-5 md:w-28 flex flex-col items-center justify-center border-r border-blue-400 border-dashed transition-colors group-hover:bg-blue-600">
              <BookOpen size={18} className="mb-2 opacity-80" />
              <p className="text-4xl font-black leading-none drop-shadow-sm">
                {new Date(material.event_date).getDate()}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1.5 opacity-90">
                {format(new Date(material.event_date), "MMM", {
                  locale: localeID,
                })}
              </p>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between bg-white relative">
              <ChevronRight
                size={20}
                className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
              />
              <div className="space-y-2 pr-6">
                <h4 className="font-black text-sm text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                  {material.title}
                </h4>
                <div
                  className="text-[11px] font-medium text-slate-500 line-clamp-2 prose prose-xs leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: material.content || "Belum ada deskripsi materi.",
                  }}
                />
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] font-bold text-blue-600">
                <Clock size={14} />
                {format(new Date(material.event_date), "HH:mm")} WIB
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
              Belum ada materi belajar terdekat.
            </p>
          </div>
        </AppCard>
      )}
    </div>
  );
}
