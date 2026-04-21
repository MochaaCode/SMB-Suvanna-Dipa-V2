"use client";

import { CalendarDays, Clock, MapPin, Megaphone, User } from "lucide-react";
import { AppCard } from "@/components/shared/AppCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ScheduleCard({ schedule }: { schedule: any }) {
  const eventDate = new Date(schedule.event_date);
  const isGlobal = schedule.is_announcement || !schedule.class;

  return (
    <AppCard className="p-0 overflow-hidden group hover:border-orange-300 transition-all hover:shadow-lg flex flex-col h-full border-slate-200">
      {/* HEADER KARTU (Tanggal & Waktu) */}
      <div
        className={`p-5 flex items-center justify-between border-b ${isGlobal ? "bg-orange-50 border-orange-100" : "bg-slate-50 border-slate-100"}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${isGlobal ? "bg-orange-100 text-orange-600" : "bg-white text-slate-600 shadow-sm"}`}
          >
            {isGlobal ? <Megaphone size={20} /> : <CalendarDays size={20} />}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">
              {eventDate.toLocaleDateString("id-ID", { weekday: "long" })}
            </p>
            <p className="text-sm font-black text-slate-800">
              {eventDate.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white shadow-sm border border-slate-100 text-xs font-bold text-slate-600">
            <Clock size={14} className="text-orange-500" />
            {eventDate.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            WIB
          </span>
        </div>
      </div>

      {/* BODY KARTU (Konten) */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          {isGlobal ? (
            <span className="inline-block px-2.5 py-1 bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest rounded-md mb-3">
              Pengumuman Global
            </span>
          ) : (
            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-md mb-3">
              Kelas: {schedule.class?.name}
            </span>
          )}
          <h3 className="text-xl font-black text-slate-800 leading-tight mb-2 group-hover:text-orange-600 transition-colors">
            {schedule.title}
          </h3>
          {/* Render JSON Content secara sederhana (Bisa di-upgrade pakai RichText parser nanti) */}
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
            {schedule.content
              ? typeof schedule.content === "string"
                ? schedule.content
                : "Ada detail kegiatan yang dilampirkan."
              : "Tidak ada deskripsi tambahan."}
          </p>
        </div>

        {/* FOOTER KARTU */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <User size={14} />
            <span>{schedule.author?.full_name || "Admin SMB"}</span>
          </div>
          {schedule.is_active && (
            <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md font-bold">
              <MapPin size={12} />
              Absen Dibuka
            </span>
          )}
        </div>
      </div>
    </AppCard>
  );
}
