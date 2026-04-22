"use client";

import { useState, useMemo } from "react";
import { Inbox } from "lucide-react";
import { ScheduleCard } from "./ScheduleCard";
import { ScheduleDetailModal } from "./ScheduleDetailModal";
import type { StudentScheduleItem } from "@/actions/student/schedules";

interface ScheduleListProps {
  schedules: StudentScheduleItem[];
  searchQuery: string;
}

export function ScheduleList({ schedules, searchQuery }: ScheduleListProps) {
  const [selectedSchedule, setSelectedSchedule] =
    useState<StudentScheduleItem | null>(null);

  const filtered = useMemo(() => {
    return schedules.filter((s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [schedules, searchQuery]);

  return (
    <div className="space-y-6">
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <ScheduleCard
              key={item.id}
              schedule={item}
              onClick={() => setSelectedSchedule(item)}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
          <Inbox size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">
            Agenda Tidak Ditemukan
          </h3>
          <p className="text-slate-400 text-sm font-medium italic mt-1 px-10">
            {searchQuery
              ? "Coba gunakan kata kunci pencarian yang lain."
              : "Belum ada agenda terdekat yang dijadwalkan."}
          </p>
        </div>
      )}

      <ScheduleDetailModal
        isOpen={!!selectedSchedule}
        onClose={() => setSelectedSchedule(null)}
        schedule={selectedSchedule}
      />
    </div>
  );
}
