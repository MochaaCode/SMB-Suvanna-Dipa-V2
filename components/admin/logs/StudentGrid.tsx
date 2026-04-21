"use client";

import { useState } from "react";
import { ChevronRight, Star, LayoutGrid, ChevronLeft } from "lucide-react";
import { StudentActivityModal } from "./StudentActivityModal";
import { AppButton } from "../../shared/AppButton";

// IMPORT TIPE KETAT
import type { StudentSummary } from "@/actions/admin/logs";

export function StudentGrid({ students }: { students: StudentSummary[] }) {
  const [selectedStudent, setSelectedStudent] = useState<StudentSummary | null>(
    null,
  );

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Menampilkan 3x3 Grid

  // =====================================================================
  // FIX ESLINT: "Update State During Render" Pattern (Pengganti useEffect)
  // =====================================================================
  // Kita buat "sidik jari" dari data saat ini (jumlah data & ID siswa pertama)
  const currentSignature = `${students.length}-${students[0]?.id}`;
  const [prevSignature, setPrevSignature] = useState(currentSignature);

  // Jika sidik jari berubah (artinya hasil pencarian berubah), reset halaman ke 1
  if (currentSignature !== prevSignature) {
    setPrevSignature(currentSignature);
    setCurrentPage(1);
  }
  // =====================================================================

  const totalPages = Math.max(1, Math.ceil(students.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = students.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="space-y-4">
      {/* JUDUL BAGIAN */}
      <div className="flex items-center gap-3 px-2 pt-2">
        <LayoutGrid size={16} className="text-orange-500" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Database Siswa
        </h2>
        <div className="h-px bg-slate-200 grow ml-2" />
      </div>

      {/* KARTU GRID */}
      {paginatedStudents.length === 0 ? (
        <div className="p-16 text-center border border-slate-200 rounded-[1rem] bg-white shadow-sm">
          <p className="text-slate-400 font-medium text-sm">
            Siswa tidak ditemukan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className="group bg-white p-4 rounded-[1rem] border border-slate-200 shadow-sm hover:border-orange-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-10 w-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center font-bold text-orange-600 text-xs shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  {student.full_name?.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-bold text-slate-800 truncate group-hover:text-orange-600 transition-colors">
                    {student.full_name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                    {student.classes?.name || "Tanpa Kelas"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="flex flex-col items-end bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-200 transition-colors">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">
                    Saldo
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-orange-600">
                    <Star size={10} fill="currentColor" /> {student.points || 0}
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      <div className="flex items-center justify-between px-2 pt-4">
        <p className="text-xs font-medium text-slate-500">
          Menampilkan{" "}
          <span className="font-bold text-slate-900">
            {students.length === 0 ? 0 : startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, students.length)}
          </span>{" "}
          dari {students.length} data
        </p>
        <div className="flex gap-2">
          <AppButton
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </AppButton>
          <AppButton
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight size={16} />
          </AppButton>
        </div>
      </div>

      {/* MODAL REKAM JEJAK */}
      <StudentActivityModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
