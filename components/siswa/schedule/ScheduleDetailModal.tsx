"use client";

import { AppModal } from "@/components/shared/AppModal";
import { Clock, MapPin, User, Megaphone, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import type { StudentScheduleItem } from "@/actions/student/schedules";

interface ScheduleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: StudentScheduleItem | null;
}

export function ScheduleDetailModal({
  isOpen,
  onClose,
  schedule,
}: ScheduleDetailModalProps) {
  if (!schedule) return null;

  const eventDate = new Date(schedule.event_date);
  const isGlobal = schedule.is_announcement || !schedule.class;

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Kegiatan"
      description="Informasi lengkap mengenai agenda yang dipilih."
      variant="orange"
      maxWidth="lg"
    >
      <div className="space-y-6 pt-4">
        {/* Header Section: Tanggal & Waktu */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem]">
          <div
            className={`p-3 rounded-2xl ${isGlobal ? "bg-orange-100 text-orange-600" : "bg-white border shadow-sm text-slate-600"}`}
          >
            {isGlobal ? <Megaphone size={24} /> : <CalendarDays size={24} />}
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">
              {format(eventDate, "EEEE", { locale: localeID })}
            </p>
            <p className="text-lg font-black text-slate-800">
              {format(eventDate, "dd MMMM yyyy", { locale: localeID })}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">
              <Clock size={14} />
              {format(eventDate, "HH:mm")} WIB
            </span>
          </div>
        </div>

        {/* Body Section: Judul & Konten HTML */}
        <div className="px-1">
          <div className="mb-3">
            {isGlobal ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-orange-600 px-2.5 py-1 bg-orange-100 rounded-md">
                <Megaphone size={10} /> Pengumuman Global
              </span>
            ) : (
              <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-md">
                Kelas: {schedule.class?.name}
              </span>
            )}
          </div>

          <h3 className="text-2xl font-black text-slate-800 leading-tight mb-4">
            {schedule.title}
          </h3>

          {/* HTML Renderer yang Aman */}
          <div
            className="prose prose-sm text-slate-600 leading-relaxed max-w-none"
            dangerouslySetInnerHTML={{
              __html:
                schedule.content ||
                "Tidak ada deskripsi rinci untuk kegiatan ini.",
            }}
          />
        </div>

        {/* Footer Section: Info Tambahan */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
            <User size={14} />
            <span>
              Oleh: <strong>{schedule.author?.full_name || "Admin SMB"}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
            <MapPin size={14} />
            <span>
              Lokasi: <strong>Vihara</strong>
            </span>
          </div>
        </div>
      </div>
    </AppModal>
  );
}
