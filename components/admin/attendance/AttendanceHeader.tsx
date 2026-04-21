/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { SquareCheckBig, Radio, PenLine } from "lucide-react";
import { finalizeAttendance } from "@/actions/admin/attendance";
import toast from "react-hot-toast";
import { PageHeader } from "../../shared/PageHeader";
import { AppButton } from "../../shared/AppButton";

import type { Schedule } from "@/types";

interface AttendanceHeaderProps {
  schedule: Schedule;
  onOpenManual: () => void;
}

export default function AttendanceHeader({
  schedule,
  onOpenManual,
}: AttendanceHeaderProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleFinalize = () => {
    if (
      confirm(
        "Selesaikan sesi presensi? Siswa yang tidak tap akan otomatis dianggap ALPA.",
      )
    ) {
      startTransition(async () => {
        try {
          const result = await finalizeAttendance(
            schedule.id,
            schedule.class_id,
          );
          if (result.success) {
            toast.success(`Sesi selesai! ${result.count} siswa dicatat ALPA.`);
            router.refresh();
          }
        } catch (error: any) {
          toast.error(error.message || "Gagal menyelesaikan sesi");
        }
      });
    }
  };

  return (
    <PageHeader
      title="MONITORING"
      highlightText="KEHADIRAN"
      icon={<Radio size={24} className="animate-pulse" />}
      themeColor="orange"
      subtitle={
        <span className="flex items-center gap-1.5">
          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          Sesi Aktif: {schedule.title}
        </span>
      }
      rightContent={
        <div className="flex items-center gap-3">
          <AppButton
            variant="outline"
            onClick={onOpenManual}
            className="rounded-[1rem] font-bold text-xs h-10 border-orange-200 text-orange-700 hover:bg-orange-50 bg-white"
            leftIcon={<PenLine size={16} />}
          >
            Absen Manual
          </AppButton>
          <AppButton
            variant="slate"
            onClick={handleFinalize}
            isLoading={isPending}
            className="rounded-[1rem] font-bold text-xs h-10"
            leftIcon={<SquareCheckBig size={16} />}
          >
            Tutup Gerbang Presensi
          </AppButton>
        </div>
      }
    />
  );
}
