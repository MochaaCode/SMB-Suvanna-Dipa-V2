"use client";

import { useState } from "react";
import { CalendarDays, Plus, BookOpen, LayoutGrid } from "lucide-react";
import { ScheduleTable } from "./ScheduleTable";
import { AddScheduleModal } from "./AddScheduleModal";
import { PageHeader } from "../../shared/PageHeader";
import { AppButton } from "../../shared/AppButton";
import { AppCard } from "../../shared/AppCard";

// IMPORT TIPE KETAT
import type { ScheduleWithRelations } from "@/actions/admin/schedules";
import type { Class } from "@/types";

interface ScheduleManagementUIProps {
  initialSchedules: ScheduleWithRelations[];
  classes: Class[];
}

export function ScheduleManagementUI({
  initialSchedules,
  classes,
}: ScheduleManagementUIProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* 1. HEADER SECTION (Menggunakan Shared Component) */}
      <PageHeader
        title="JADWAL &"
        highlightText="MATERI"
        icon={<CalendarDays size={24} />}
        subtitle={
          <>
            <BookOpen size={14} className="text-orange-500" />
            Agenda Mingguan & Pengumuman Pembelajaran Siswa
          </>
        }
        themeColor="orange"
        rightContent={
          <AppButton
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus size={16} />}
            className="font-bold"
          >
            Buat Jadwal Baru
          </AppButton>
        }
      />

      {/* 2. TABLE SECTION TITLE */}
      <div className="flex items-center gap-3 px-2">
        <LayoutGrid size={16} className="text-orange-500" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Database Agenda & Materi
        </h2>
        <div className="h-px bg-slate-200 grow ml-2" />
      </div>

      {/* 3. TABLE CONTAINER (Menggunakan AppCard) */}
      <AppCard noPadding className="border-slate-200 shadow-sm">
        <ScheduleTable schedules={initialSchedules} classes={classes} />
      </AppCard>

      {/* 4. MODAL TAMBAH JADWAL */}
      <AddScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classes={classes}
      />
    </div>
  );
}
