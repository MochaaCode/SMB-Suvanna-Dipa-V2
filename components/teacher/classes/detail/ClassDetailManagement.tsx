"use client";

import { useState } from "react";
import {
  GraduationCap,
  Users,
  QrCode,
  ClipboardCheck,
  Award,
  ArrowLeft,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppCard } from "@/components/shared/AppCard";
import { AppButton } from "@/components/shared/AppButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button
        onClick={() => router.push("/pembina/classes")}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft size={16} /> Kembali ke Daftar Kelas
      </button>

      <PageHeader
        title="Kelas"
        highlightText={classInfo.name}
        subtitle={`Anda bertugas sebagai ${classInfo.roleInClass} di kelas ini.`}
        icon={<GraduationCap size={24} />}
        themeColor="orange"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AppButton
          variant="default"
          className="h-14 text-sm"
          leftIcon={<QrCode size={20} />}
        >
          Mulai Scan RFID
        </AppButton>
        <AppButton
          onClick={() => setIsAttendModalOpen(true)}
          variant="outline"
          className="h-14 text-sm border-orange-200 text-orange-700 hover:bg-orange-50"
          leftIcon={<ClipboardCheck size={20} />}
        >
          Absensi Manual
        </AppButton>
        <AppButton
          onClick={() => setIsPointsModalOpen(true)}
          variant="outline"
          className="h-14 text-sm border-blue-200 text-blue-700 hover:bg-blue-50"
          leftIcon={<Award size={20} />}
        >
          Bagi Poin Kelas
        </AppButton>
      </div>

      <AppCard className="p-0 overflow-hidden border-slate-200">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Users size={18} className="text-orange-500" />
            Daftar Siswa ({students.length})
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {students.length > 0 ? (
            students.map((student) => (
              <div
                key={student.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border border-slate-200">
                    <AvatarImage src={student.avatar_url || ""} />
                    <AvatarFallback className="bg-orange-100 text-orange-700 font-bold">
                      {student.full_name?.charAt(0).toUpperCase() || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {student.full_name}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {student.buddhist_name && student.buddhist_name !== "NULL"
                        ? student.buddhist_name
                        : student.gender || "Gender tidak diketahui"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black">
                    <Award size={14} className="fill-blue-500 text-blue-500" />
                    {student.points} Poin
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-slate-500 text-sm font-medium italic">
              Belum ada siswa yang terdaftar di kelas ini.
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
