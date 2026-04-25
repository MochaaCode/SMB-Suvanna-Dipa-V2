"use client";

import { GraduationCap, UserCircle2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClassDetailSheet } from "./ClassDetailSheet";
import { AppCard } from "../../shared/AppCard";

import type { ClassWithDetails } from "@/actions/admin/classes";
import type { Profile } from "@/types";

interface ClassCardProps {
  cls: ClassWithDetails;
  promoCount: number;
  allPembina: Pick<Profile, "id" | "full_name" | "avatar_url">[];
  allGL: Pick<Profile, "id" | "full_name" | "avatar_url">[];
  allClasses: ClassWithDetails[];
}

export function ClassCard({
  cls,
  promoCount,
  allPembina,
  allGL,
  allClasses,
}: ClassCardProps) {
  return (
    <AppCard className="relative group border border-slate-200 hover:border-orange-300 transition-all rounded-[1rem] bg-white overflow-hidden">
      <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 text-orange-900 pointer-events-none">
        <GraduationCap size={160} />
      </div>

      <div className="relative z-10 space-y-5 p-1">
        <div className="flex justify-between items-start text-left gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800 leading-tight">
              Kelas {cls.name}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Rentang Usia: {cls.min_age} - {cls.max_age} Tahun
            </p>
          </div>
          <Badge className="bg-orange-50 text-orange-700 border-orange-200 font-bold px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap shadow-sm hover:bg-orange-100">
            {cls.students?.length || 0} Siswa
          </Badge>
        </div>

        <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 group/teacher hover:bg-white transition-colors text-left">
          <p className="text-[9px] font-bold uppercase flex items-center gap-1.5 text-slate-500 mb-2.5 tracking-wider leading-none">
            <UserCircle2 size={12} className="text-orange-600" /> Pengajar Utama
          </p>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-orange-700 text-xs shrink-0">
              {cls.teacher?.full_name?.substring(0, 2).toUpperCase() || "?"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-800 truncate leading-none mb-1.5">
                {cls.teacher?.full_name || "Belum Ditentukan"}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium leading-none">
                <Users size={12} /> {cls.assistant_ids?.length || 0} Asisten
                (GL)
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
            promoCount > 0
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              promoCount > 0 ? "bg-red-500 animate-pulse" : "bg-green-500"
            }`}
          />
          <span
            className={`text-[10px] font-bold tracking-wide uppercase ${
              promoCount > 0 ? "text-red-700" : "text-green-700"
            }`}
          >
            {promoCount > 0
              ? `${promoCount} Siswa Perlu Promosi`
              : "Kesesuaian Usia Aman"}
          </span>
        </div>

        <ClassDetailSheet
          cls={cls}
          allPembina={allPembina}
          allGL={allGL}
          allClasses={allClasses}
        />
      </div>
    </AppCard>
  );
}
