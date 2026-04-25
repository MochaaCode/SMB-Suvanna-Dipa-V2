"use client";

import { ClassCard } from "./ClassCard";
import { PromotionAlarm } from "./PromotionAlarm";
import { PageHeader } from "../../shared/PageHeader";
import { GraduationCap, LayoutGrid } from "lucide-react";

import type {
  ClassWithDetails,
  PromotionSuggestion,
} from "@/actions/admin/classes";
import type { Profile } from "@/types";

interface ClassManagementUIProps {
  classes: ClassWithDetails[];
  promotions: PromotionSuggestion[];
  allPembina: Pick<Profile, "id" | "full_name" | "avatar_url">[];
  allGL: Pick<Profile, "id" | "full_name" | "avatar_url">[];
}

export function ClassManagementUI({
  classes,
  promotions,
  allPembina,
  allGL,
}: ClassManagementUIProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <PageHeader
        title="MANAJEMEN"
        highlightText="KELAS"
        subtitle="Kelola Penempatan & Promosi Siswa SMB Suvanna Dipa"
        icon={<GraduationCap size={24} />}
        themeColor="orange"
        rightContent={<PromotionAlarm promotions={promotions} />}
      />

      <div className="flex items-center gap-3 px-2">
        <LayoutGrid size={16} className="text-orange-500" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Daftar Kelas Aktif
        </h2>
        <div className="h-px bg-slate-200 grow ml-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <ClassCard
            key={cls.id}
            cls={cls}
            promoCount={
              promotions.filter((p) => p.currentClassId === cls.id).length
            }
            allPembina={allPembina}
            allGL={allGL}
            allClasses={classes}
          />
        ))}
      </div>
    </div>
  );
}
