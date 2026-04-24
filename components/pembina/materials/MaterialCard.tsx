"use client";

import { Edit3, Clock, CheckCircle2, AlertCircle } from "lucide-react";
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
  const hasContent = !!item.description && item.description.trim().length > 0;
  const eventDate = new Date(item.date);

  return (
    <AppCard className="p-0 overflow-hidden border-slate-200 hover:border-orange-300 transition-all group">
      <div className="flex flex-col md:flex-row">
        <div
          className={`p-4 md:w-32 flex md:flex-col items-center justify-center gap-2 text-white ${hasContent ? "bg-orange-500" : "bg-slate-400"}`}
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
              {hasContent ? (
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
            <div className={hasContent ? "text-green-600" : "text-amber-600"}>
              {hasContent ? "Materi Tersedia" : "Materi Kosong"}
            </div>
          </div>

          <div className="pt-2">
            <AppButton
              variant={hasContent ? "outline" : "orange"}
              size="sm"
              className="w-full md:w-auto h-9 rounded-xl font-bold text-[11px]"
              leftIcon={<Edit3 size={14} />}
              onClick={onOpenModal}
            >
              {hasContent ? "Edit Materi" : "Isi Materi Sekarang"}
            </AppButton>
          </div>
        </div>
      </div>
    </AppCard>
  );
}
