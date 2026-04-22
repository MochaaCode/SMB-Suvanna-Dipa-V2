"use client";

import { useState, useMemo } from "react";
import { GraduationCap, Search, Inbox, Users, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppCard } from "@/components/shared/AppCard";
import { Input } from "@/components/ui/input";
import { ClassCard } from "./ClassCard";
import { useDebounce } from "@/hooks/useDebounce";

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
  const debouncedSearch = useDebounce(searchQuery, 300);

  // OPTIMASI: Filter data kelas dengan memoization untuk performa smooth
  const filteredClasses = useMemo(() => {
    return classes.filter((cls) =>
      cls.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [classes, debouncedSearch]);

  const totalAuthorized = classes.filter((c) => c.isAuthorized).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <PageHeader
        title="MANAJEMEN"
        highlightText="KELAS"
        subtitle="Kelola absensi dan poin siswa di kelas yang telah ditugaskan."
        icon={<GraduationCap size={24} />}
        themeColor="orange"
      />

      {/* QUICK STATS - Menambah kesan "Data Rich" */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppCard className="p-5 flex items-center gap-4 bg-orange-50 border-orange-100 shadow-none">
          <div className="p-3 bg-white rounded-xl text-orange-600 shadow-sm border border-orange-100">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest leading-none">
              Otoritas Kelas
            </p>
            <p className="text-xl font-black text-orange-700">
              {totalAuthorized} Kelas Aktif
            </p>
          </div>
        </AppCard>
        <AppCard className="p-5 flex items-center gap-4 bg-slate-50 border-slate-200 shadow-none">
          <div className="p-3 bg-white rounded-xl text-slate-600 shadow-sm border border-slate-100">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Total Siswa Terbina
            </p>
            <p className="text-xl font-black text-slate-800">
              {classes
                .filter((c) => c.isAuthorized)
                .reduce((acc, curr) => acc + curr.studentCount, 0)}{" "}
              Siswa
            </p>
          </div>
        </AppCard>
      </div>

      <AppCard className="p-4 bg-white border-slate-200 shadow-sm rounded-[1rem]">
        <div className="relative w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <Input
            placeholder="Cari nama kelas Anda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 bg-slate-50 border-transparent rounded-[1rem] focus-visible:ring-orange-500 font-bold text-sm"
          />
        </div>
      </AppCard>

      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
        <div className="py-24 text-center space-y-4 bg-white rounded-[2rem] border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
            <Inbox size={32} className="text-slate-300" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-800 font-black text-lg">
              Kelas Tidak Ditemukan
            </p>
            <p className="text-slate-500 text-xs font-medium px-10">
              Pastikan nama kelas yang Anda cari sudah benar atau hubungi admin
              jika kelas belum terdaftar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
