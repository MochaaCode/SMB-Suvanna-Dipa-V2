/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { SquareCheckBig, Radio, PenLine } from "lucide-react";
import { finalizeAttendance } from "@/actions/admin/attendance";
import toast from "react-hot-toast";
import { PageHeader } from "../../shared/PageHeader";
import { AppButton } from "../../shared/AppButton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const router = useRouter();

  const handleFinalize = () => {
    startTransition(async () => {
      try {
        const result = await finalizeAttendance(
          schedule.id,
          schedule.class_id,
        );
        if (result.success) {
          toast.success(`Sesi selesai! ${result.count} siswa dicatat ALPA.`);
          setIsConfirmOpen(false);
          router.refresh();
        }
      } catch (error: any) {
        toast.error(error.message || "Gagal menyelesaikan sesi");
      }
    });
  };

  return (
    <>
      <PageHeader
        title="KELOLA"
        highlightText="PRESENSI"
        icon={<Radio size={24} className="animate-pulse" />}
        themeColor="orange"
        subtitle={
          <span className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            Sesi Aktif: {schedule.title}
          </span>
        }
        rightContent={
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
            <AppButton
              variant="orange"
              onClick={onOpenManual}
              className="rounded-[1rem] font-bold text-xs h-10 w-full sm:w-auto"
              leftIcon={<PenLine size={16} />}
            >
              Absen Manual
            </AppButton>
            <AppButton
              variant="slate"
              onClick={() => setIsConfirmOpen(true)}
              isLoading={isPending}
              className="rounded-[1rem] font-bold text-xs h-10 w-full sm:w-auto"
              leftIcon={<SquareCheckBig size={16} />}
            >
              Akhiri Sesi Presensi
            </AppButton>
          </div>
        }
      />

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-[1rem] p-8 border-slate-200 shadow-xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-800">
              Akhiri Sesi Presensi?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-slate-600 mt-2 leading-relaxed">
              Selesaikan sesi presensi ini? Siswa yang belum mencatat kehadiran akan otomatis tercatat sebagai <strong>Tanpa Keterangan (ALPA)</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel asChild>
              <AppButton
                variant="outline"
                disabled={isPending}
                className="h-10 text-xs rounded-[1rem]"
              >
                Batal
              </AppButton>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <AppButton
                variant="default"
                onClick={handleFinalize}
                isLoading={isPending}
                className="h-10 text-xs rounded-[1rem]"
              >
                Ya, Akhiri Sesi
              </AppButton>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
