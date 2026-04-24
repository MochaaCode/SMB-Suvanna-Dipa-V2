"use client";

import { CalendarDays, Clock, MapPin } from "lucide-react";
import { AppCard } from "@/components/shared/AppCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function UpcomingSchedulesList({ schedules }: { schedules: any[] }) {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="h-64 border-2 border-dashed border-slate-200 rounded-[1rem] flex items-center justify-center text-slate-400 text-sm font-medium italic">
        Tidak ada jadwal kelas dalam waktu dekat.
      </div>
    );
  }

  return (
    <AppCard className="p-0 overflow-hidden border-slate-100 flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 bg-orange-50/50 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <CalendarDays size={18} className="text-orange-500" />
          Agenda & Jadwal Terdekat
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {schedules.map((sched) => {
          const eventDate = new Date(sched.event_date);
          return (
            <div
              key={sched.id}
              className="p-4 border border-slate-100 rounded-xl hover:border-orange-200 transition-colors bg-white shadow-sm flex items-start gap-4"
            >
              <div className="text-center bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 shrink-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-0.5">
                  {eventDate.toLocaleDateString("id-ID", { month: "short" })}
                </p>
                <p className="text-xl font-black text-slate-700 leading-none">
                  {eventDate.toLocaleDateString("id-ID", { day: "numeric" })}
                </p>
              </div>
              <div className="flex-1 pt-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-800 truncate mb-1">
                  {sched.title}
                </h4>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-slate-400" />
                    {eventDate.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    WIB
                  </span>
                  {!sched.is_announcement && sched.class && (
                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-600">
                      <MapPin size={10} /> {sched.class.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppCard>
  );
}
