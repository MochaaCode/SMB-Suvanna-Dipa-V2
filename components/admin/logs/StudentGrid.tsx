"use client";

import { useState } from "react";
import { ChevronRight, Star, LayoutGrid, ChevronLeft } from "lucide-react";
import { StudentActivityModal } from "./StudentActivityModal";
import { AppButton } from "../../shared/AppButton";

import type { StudentSummary } from "@/actions/admin/logs";

export function StudentGrid({ students }: { students: StudentSummary[] }) {
  const [selectedStudent, setSelectedStudent] = useState<StudentSummary | null>(
    null,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [prevStudents, setPrevStudents] = useState(students);
  if (students !== prevStudents) {
    setPrevStudents(students);
    setCurrentPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(students.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = students.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-[1rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-[0.8rem] border border-slate-200 shadow-sm">
            <LayoutGrid size={16} className="text-orange-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-800">
            Daftar Akun Siswa
          </h2>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/30">
        {currentData.map((s) => (
          <div
            key={s.id}
            onClick={() => setSelectedStudent(s)}
            className="group cursor-pointer bg-white p-5 rounded-[1rem] border border-slate-200 shadow-sm hover:border-orange-300 hover:shadow-md transition-all flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[0.8rem] bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-black text-sm">
                  {s.full_name?.substring(0, 2).toUpperCase()}
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {s.full_name}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {s.classes?.name || "Tanpa Kelas"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-lg font-black text-xs">
                <Star size={12} fill="currentColor" />
                {s.points} Pts
              </div>
              <ChevronRight
                size={16}
                className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Menampilkan {students.length === 0 ? 0 : startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, students.length)} dari{" "}
          {students.length} Siswa
        </p>
        <div className="flex gap-2">
          <AppButton
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg border-slate-200"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </AppButton>
          <div className="flex items-center px-3 text-xs font-black text-slate-600">
            {currentPage} / {totalPages || 1}
          </div>
          <AppButton
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg border-slate-200"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight size={16} />
          </AppButton>
        </div>
      </div>

      <StudentActivityModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
