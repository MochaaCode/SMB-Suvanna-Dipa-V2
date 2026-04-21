"use client";

import { useState } from "react";
import { GraduationCap, Search, Inbox } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppCard } from "@/components/shared/AppCard";
import { Input } from "@/components/ui/input";
import { ClassCard } from "./ClassCard";

// Interface data sesuai dengan balikan dari Server Action
interface ClassData {
  id: number;
  name: string;
  slug: string;
  studentCount: number;
  isAuthorized: boolean;
  roleInClass: string | null;
}

interface PembinaClassManagementProps {
  classes: ClassData[];
}

export function PembinaClassManagement({
  classes,
}: PembinaClassManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Manajemen"
        highlightText="Kelas"
        subtitle="Pilih kelas Anda untuk mengelola absensi dan poin siswa."
        icon={<GraduationCap size={24} />}
        themeColor="orange"
      />

      <AppCard className="p-4 bg-slate-50/50 border-slate-200">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Cari nama kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white border-slate-200 focus-visible:ring-orange-500"
          />
        </div>
      </AppCard>

      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => (
            <ClassCard
              key={cls.id}
              name={cls.name}
              slug={cls.slug}
              studentCount={cls.studentCount}
              isAuthorized={cls.isAuthorized}
              roleInClass={cls.roleInClass}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2">
            <Inbox size={28} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium italic">
            {searchQuery ? "Kelas tidak ditemukan." : "Belum ada data kelas."}
          </p>
        </div>
      )}
    </div>
  );
}
