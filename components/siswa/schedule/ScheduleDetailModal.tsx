"use client";

import { AppModal } from "@/components/shared/AppModal";
import { Clock, User, Megaphone, CalendarDays, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import type { StudentScheduleItem } from "@/actions/siswa/schedules";

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

  const formatTime = (t: string | null) => {
    if (!t) return null;
    return t.substring(0, 5);
  };
  const startTime = formatTime(schedule.start_time);
  const endTime = formatTime(schedule.end_time);

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Kegiatan"
      description="Informasi lengkap mengenai agenda yang dipilih."
      variant="orange"
      maxWidth="lg"
    >
      <div className="space-y-5 pt-4">
        <div>
          {isGlobal ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-orange-600 px-3 py-1.5 bg-orange-100 rounded-lg">
              <Megaphone size={11} /> Pengumuman Global
            </span>
          ) : (
            <span className="inline-block px-3 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
              Kelas: {schedule.class?.name}
            </span>
          )}
        </div>

        <h3 className="text-2xl font-black text-slate-800 leading-tight">
          {schedule.title}
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl">
            <CalendarDays size={16} className="text-orange-500" />
            <span className="text-sm font-bold text-slate-700">
              {format(eventDate, "EEEE, dd MMMM yyyy", { locale: localeID })}
            </span>
          </div>
          {(startTime || endTime) && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 border border-orange-100 rounded-2xl">
              <Clock size={16} className="text-orange-500" />
              <span className="text-sm font-bold text-orange-700">
                {startTime || "-"}
                {endTime ? ` – ${endTime}` : ""} WIB
              </span>
            </div>
          )}
        </div>

        <div className="px-1">
          <div
            className="prose prose-sm text-slate-600 leading-relaxed max-w-none"
            dangerouslySetInnerHTML={{
              __html:
                schedule.content ||
                "Tidak ada deskripsi rinci untuk kegiatan ini.",
            }}
          />

          {!schedule.is_announcement && schedule.materials && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <BookOpen size={11} /> Materi Pembahasan dari Pembina
              </p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {schedule.materials}
              </p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-2 rounded-xl">
          <User size={14} />
          <span>
            Oleh: <strong>{schedule.author?.full_name || "Admin SMB"}</strong>
          </span>
        </div>
      </div>
    </AppModal>
  );
}
