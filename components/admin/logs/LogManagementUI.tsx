"use client";

import { useState, useMemo } from "react";
import { History, Search, Users } from "lucide-react";
import { PageHeader } from "../../shared/PageHeader";
import { Input } from "@/components/ui/input";
import { StudentGrid } from "./StudentGrid";
import { useDebounce } from "@/hooks/useDebounce";

import type { StudentSummary } from "@/actions/admin/logs";

export function LogManagementUI({ students }: { students: StudentSummary[] }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const filteredStudents = useMemo(() => {
    if (!debouncedSearch) return students;
    const lowerQuery = debouncedSearch.toLowerCase();

    return students.filter(
      (s) =>
        s.full_name?.toLowerCase().includes(lowerQuery) ||
        s.buddhist_name?.toLowerCase().includes(lowerQuery),
    );
  }, [students, debouncedSearch]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <PageHeader
        title="LOG"
        highlightText="AKTIVITAS"
        icon={<History size={24} />}
        subtitle="Pantau riwayat transaksi poin, kehadiran, dan penukaran hadiah."
        themeColor="orange"
        rightContent={
          <div className="relative group w-full md:w-72">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
              size={16}
            />
            <Input
              placeholder="Cari nama siswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 h-11 border-slate-200 rounded-[1rem] text-sm font-medium focus-visible:ring-orange-500 shadow-sm transition-all"
            />
          </div>
        }
      />

      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[1rem] border border-dashed border-slate-300 shadow-sm">
          <div className="p-5 bg-slate-50 rounded-xl mb-5 border border-slate-100">
            <Users size={40} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Siswa Tidak Ditemukan
          </h3>
          <p className="text-slate-500 max-w-sm font-medium text-sm">
            Tidak ada siswa yang cocok dengan kata kunci &quot;{search}&quot;.
          </p>
        </div>
      ) : (
        <StudentGrid students={filteredStudents} />
      )}
    </div>
  );
}
