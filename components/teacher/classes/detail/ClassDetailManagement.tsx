"use client";

import { useState } from "react";
import {
  GraduationCap,
  Users,
  ClipboardCheck,
  Award,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppCard } from "@/components/shared/AppCard";
import { AppButton } from "@/components/shared/AppButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { ManualAttendanceModal } from "./ManualAttendanceModal";
import { BulkGivePointsModal } from "./BulkGivePointsModal";

interface StudentData {
  id: string;
  full_name: string | null;
  buddhist_name: string | null;
  points: number;
  gender: string | null;
  avatar_url: string | null;
}

interface ClassDetailManagementProps {
  classInfo: {
    id: number;
    name: string;
    roleInClass: string;
  };
  students: StudentData[];
}

export function ClassDetailManagement({
  classInfo,
  students,
}: ClassDetailManagementProps) {
  const router = useRouter();
  const [isAttendModalOpen, setIsAttendModalOpen] = useState(false);
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);

  const avgPoints = students.length
    ? Math.floor(
        students.reduce((acc, s) => acc + s.points, 0) / students.length,
      )
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex items-center gap-2 mb-2">
        <AppButton
          variant="secondary"
          size="sm"
          onClick={() => router.push("/pembina/classes")}
          leftIcon={<ArrowLeft size={16} />}
          className="rounded-full h-9 px-4 font-bold bg-white border-slate-200 hover:bg-slate-50"
        >
          Kembali
        </AppButton>
      </div>

      <PageHeader
        title="DETAIL"
        highlightText={`KELAS ${classInfo.name.toUpperCase()}`}
        subtitle={`Manajemen kehadiran dan distribusi poin untuk ${classInfo.roleInClass}.`}
        icon={<GraduationCap size={24} />}
        themeColor="orange"
      />

      {/* METRIC SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppCard className="p-6 border-none bg-linear-to-br from-orange-500 to-orange-600 text-white flex justify-between items-center overflow-hidden relative">
          <div className="z-10">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
              Total Murid
            </p>
            <p className="text-4xl font-black mt-1">{students.length}</p>
          </div>
          <Users size={80} className="absolute -right-4 -bottom-4 opacity-10" />
        </AppCard>
        <AppCard className="p-6 border-slate-200 bg-white flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Rata-rata Poin
            </p>
            <p className="text-4xl font-black text-slate-800 mt-1">
              {avgPoints}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-2xl text-yellow-600 border border-yellow-100 shadow-sm">
            <Sparkles size={32} fill="currentColor" />
          </div>
        </AppCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppButton
          onClick={() => setIsAttendModalOpen(true)}
          className="h-16 rounded-[1rem] bg-white text-orange-600 border-2 border-orange-100 hover:bg-orange-50 hover:border-orange-200 shadow-sm font-black text-xs uppercase tracking-wider"
          leftIcon={<ClipboardCheck size={20} />}
        >
          Presensi Manual
        </AppButton>
        <AppButton
          onClick={() => setIsPointsModalOpen(true)}
          className="h-16 rounded-[1rem] bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200 font-black text-xs uppercase tracking-wider"
          leftIcon={<Award size={20} />}
        >
          Bagikan Poin Masal
        </AppButton>
      </div>

      <AppCard className="p-0 overflow-hidden border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">
            Daftar Murid Aktif
          </h3>
          <span className="text-[10px] font-bold text-slate-400 italic">
            Data diperbarui secara real-time
          </span>
        </div>
        <div className="divide-y divide-slate-50">
          {students.length > 0 ? (
            students.map((student) => (
              <div
                key={student.id}
                className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 rounded-[1rem] border-2 border-white shadow-sm ring-1 ring-slate-100">
                    <AvatarFallback className="bg-orange-100 text-orange-600 font-black text-sm">
                      {student.full_name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                      {student.full_name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {student.buddhist_name && student.buddhist_name !== "NULL"
                        ? student.buddhist_name
                        : student.gender || "DATA TIDAK LENGKAP"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[1rem] bg-white border border-slate-200 text-slate-700 text-xs font-black shadow-sm group-hover:border-orange-200 group-hover:text-orange-600 transition-all">
                    <Award size={14} className="text-orange-500" />
                    {student.points}{" "}
                    <span className="text-[9px] font-bold opacity-60">Pts</span>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <Users size={32} className="mx-auto text-slate-200 mb-2" />
              <p className="text-slate-400 text-sm font-bold">
                Belum ada murid di kelas ini.
              </p>
            </div>
          )}
        </div>
      </AppCard>

      <ManualAttendanceModal
        isOpen={isAttendModalOpen}
        onClose={() => setIsAttendModalOpen(false)}
        students={students}
      />
      <BulkGivePointsModal
        isOpen={isPointsModalOpen}
        onClose={() => setIsPointsModalOpen(false)}
        students={students}
      />
    </div>
  );
}
