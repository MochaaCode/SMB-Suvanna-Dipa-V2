"use client";

import {
  Edit3,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { AppCard } from "@/components/shared/AppCard";
import { AppButton } from "@/components/shared/AppButton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { ExtendedSchedule } from "@/actions/pembina/materials";

interface MaterialCardProps {
  item: ExtendedSchedule;
  onOpenModal: () => void;
}

export function MaterialCard({ item, onOpenModal }: MaterialCardProps) {
  const hasMaterials = !!item.materials && item.materials.trim().length > 0;
  const hasContent = !!item.content && item.content.trim().length > 0;
  const eventDate = new Date(item.event_date);

  return (
    <AppCard className="p-0 overflow-hidden border-slate-200 hover:border-orange-300 transition-all group">
      <div className="flex flex-col md:flex-row">
        <div
          className={`p-4 md:w-32 flex md:flex-col items-center justify-center gap-2 text-white ${hasMaterials ? "bg-orange-500" : "bg-slate-400"}`}
        >
          <span className="text-2xl font-black">{format(eventDate, "dd")}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {format(eventDate, "MMM yyyy", { locale: id })}
          </span>
        </div>

        <div className="p-5 flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge
                variant="outline"
                className="mb-2 text-[9px] uppercase font-black tracking-tighter border-orange-200 text-orange-600"
              >
                {item.class?.name || "Semua Kelas"}
              </Badge>
              <h3 className="font-bold text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">
                {item.title}
              </h3>
            </div>
            <div className="shrink-0">
              {hasMaterials ? (
                <CheckCircle2 className="text-green-500" size={20} />
              ) : (
                <AlertCircle className="text-amber-400" size={20} />
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {item.start_time ? item.start_time.substring(0, 5) : "00:00"} WIB
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <div className={hasMaterials ? "text-green-600" : "text-amber-600"}>
              {hasMaterials ? "Materi Tersedia" : "Materi Kosong"}
            </div>
          </div>

          {hasContent && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                <BookOpen size={10} /> Konten dari Admin
              </p>
              <div
                className="prose prose-xs max-w-none text-slate-600 text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.content as string }}
              />
            </div>
          )}

          <div className="pt-2">
            <AppButton
              variant={hasMaterials ? "outline" : "orange"}
              size="sm"
              className="w-full md:w-auto h-9 rounded-xl font-bold text-[11px]"
              leftIcon={<Edit3 size={14} />}
              onClick={onOpenModal}
            >
              {hasMaterials ? "Edit Materi Pembahasan" : "Isi Materi Sekarang"}
            </AppButton>
          </div>
        </div>
      </div>
    </AppCard>
  );
}
