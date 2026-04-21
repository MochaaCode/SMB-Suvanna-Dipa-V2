"use client";

import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  CalendarDays,
  Plus,
  BookOpen,
  Search,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { ScheduleTable } from "./ScheduleTable";
import { AddScheduleModal } from "./AddScheduleModal";
import { PageHeader } from "../../shared/PageHeader";
import { AppButton } from "../../shared/AppButton";
import { AppCard } from "../../shared/AppCard";
import { Input } from "@/components/ui/input";

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
  const [isTrashMode, setIsTrashMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // LOGIKA CACHING: Filter berdasarkan status delete dan pencarian judul
  const processedSchedules = useMemo(() => {
    let result = isTrashMode
      ? initialSchedules.filter((s) => s.is_deleted)
      : initialSchedules.filter((s) => !s.is_deleted);

    if (debouncedSearchQuery) {
      result = result.filter((s) =>
        s.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
      );
    }
    return result;
  }, [initialSchedules, isTrashMode, debouncedSearchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <PageHeader
        title={isTrashMode ? "TEMPAT SAMPAH" : "JADWAL &"}
        highlightText={isTrashMode ? "JADWAL" : "MATERI"}
        icon={isTrashMode ? <Trash2 size={24} /> : <CalendarDays size={24} />}
        subtitle={
          isTrashMode ? (
            "Data jadwal dan pengumuman yang telah dihapus"
          ) : (
            <>
              <BookOpen size={14} className="text-orange-500" /> Agenda Mingguan
              & Pengumuman Pembelajaran Siswa
            </>
          )
        }
        themeColor={isTrashMode ? "red" : "orange"}
      />

      <AppCard className="p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 border-slate-200 shadow-sm rounded-[1rem]">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <Input
            placeholder="Cari judul jadwal atau pengumuman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pl-10 rounded-[1rem] border-slate-200 bg-slate-50 font-medium text-sm focus-visible:ring-orange-500 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <AppButton
            variant={isTrashMode ? "secondary" : "red"}
            onClick={() => setIsTrashMode(!isTrashMode)}
            className="h-10 text-xs rounded-[1rem]"
            leftIcon={
              isTrashMode ? <ArrowLeft size={16} /> : <Trash2 size={16} />
            }
          >
            {isTrashMode ? "Kembali" : "Tempat Sampah"}
          </AppButton>

          {!isTrashMode && (
            <AppButton
              onClick={() => setIsModalOpen(true)}
              variant="default"
              className="h-10 text-xs font-bold rounded-[1rem]"
              leftIcon={<Plus size={16} />}
            >
              Buat Jadwal Baru
            </AppButton>
          )}
        </div>
      </AppCard>

      <AppCard
        noPadding
        className="border-slate-200 shadow-sm rounded-[1rem] overflow-hidden"
      >
        <ScheduleTable
          schedules={processedSchedules}
          classes={classes}
          isTrashMode={isTrashMode}
        />
      </AppCard>

      <AddScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classes={classes}
      />
    </div>
  );
}
