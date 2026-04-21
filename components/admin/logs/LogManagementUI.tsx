"use client";

import { useState } from "react";
import { History, Search } from "lucide-react";
import { PageHeader } from "../../shared/PageHeader";
import { Input } from "@/components/ui/input";
import { StudentGrid } from "./StudentGrid";

// IMPORT TIPE KETAT
import type { StudentSummary } from "@/actions/admin/logs";

export function LogManagementUI({ students }: { students: StudentSummary[] }) {
  const [search, setSearch] = useState("");

  const filtered = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.buddhist_name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <PageHeader
        title="REKAM JEJAK"
        highlightText="AKTIVITAS"
        icon={<History size={24} />}
        subtitle="Audit Transaksi Poin, Kehadiran, & Penukaran Hadiah"
        themeColor="orange"
        rightContent={
          <div className="relative group w-full md:w-64">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
              size={16}
            />
            <Input
              placeholder="Cari nama siswa..."
              className="w-full pl-10 pr-4 h-10 border-slate-200 rounded-lg text-sm font-medium focus-visible:ring-orange-500 shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
      />

      {/* COMPONENT TERPISAH: STUDENT GRID */}
      <StudentGrid students={filtered} />
    </div>
  );
}
