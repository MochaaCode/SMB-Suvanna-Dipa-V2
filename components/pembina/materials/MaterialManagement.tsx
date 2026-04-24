"use client";

import { useState } from "react";
import { BookOpen, Calendar } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MaterialCard } from "./MaterialCard";
import { MaterialModal } from "./MaterialModal";
import type { ExtendedSchedule } from "@/actions/pembina/materials";

export function MaterialManagement({
  materials,
}: {
  materials: ExtendedSchedule[];
}) {
  const [selectedSched, setSelectedSched] = useState<ExtendedSchedule | null>(
    null,
  );

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      <PageHeader
        title="MATERI"
        highlightText="PEMBAHASAN"
        subtitle="Kelola bahan ajar dan ringkasan materi untuk setiap pertemuan kelas."
        icon={<BookOpen size={24} />}
        themeColor="orange"
      />

      <div className="space-y-4">
        {materials.length > 0 ? (
          materials.map((item) => (
            <MaterialCard
              key={item.id}
              item={item}
              onOpenModal={() => setSelectedSched(item)}
            />
          ))
        ) : (
          <div className="py-24 text-center space-y-4 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <Calendar size={48} className="mx-auto text-slate-200" />
            <h3 className="text-lg font-bold text-slate-800">
              Tidak Ada Jadwal Kelas
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto text-sm">
              Belum ada jadwal kegiatan yang terdaftar untuk kelas binaan Anda.
            </p>
          </div>
        )}
      </div>

      <MaterialModal
        selectedSched={selectedSched}
        onClose={() => setSelectedSched(null)}
      />
    </div>
  );
}
