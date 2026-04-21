/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransition, useState } from "react";
import { promoteStudentsBulk } from "@/actions/admin/classes";
import {
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info,
  Users,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";
import { AppButton } from "../../shared/AppButton";
import { AppModal } from "../../shared/AppModal";

import type { PromotionSuggestion } from "@/actions/admin/classes";

interface PromotionAlarmProps {
  promotions: PromotionSuggestion[];
}

export function PromotionAlarm({ promotions }: PromotionAlarmProps) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (promotions.length === 0) return null;

  const handleExecute = () => {
    setIsConfirmOpen(false);
    startTransition(async () => {
      const tid = toast.loading("Memproses mutasi massal...");
      try {
        const result = await promoteStudentsBulk(promotions);
        if (result.success > 0) {
          toast.success(`${result.success} siswa berhasil dipromosikan!`, {
            id: tid,
          });
          setIsModalOpen(false);
        } else {
          toast.error("Gagal memperbarui data siswa.", { id: tid });
        }
      } catch (error: any) {
        toast.error(`Terjadi kesalahan: ${error.message}`, { id: tid });
      }
    });
  };

  return (
    <>
      <AppButton
        variant="red"
        onClick={() => setIsModalOpen(true)}
        className="animate-pulse shadow-red-100 font-bold rounded-[1rem]"
        leftIcon={<AlertCircle size={16} />}
      >
        {promotions.length} Siswa Perlu Tindakan
      </AppButton>

      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Saran Promosi Mutasi"
        description="Daftar siswa yang telah melewati batas usia kelas (Cutoff: 1 Juli)."
        variant="red"
        maxWidth="2xl"
        footer={
          <div className="w-full space-y-4">
            <AppButton
              onClick={() => setIsConfirmOpen(true)}
              isLoading={isPending}
              className="w-full h-12 bg-orange-600 hover:bg-orange-700 font-bold shadow-md rounded-[1rem]"
              leftIcon={<CheckCircle2 size={18} />}
            >
              Eksekusi Mutasi Massal
            </AppButton>
            <div className="flex items-center gap-2 justify-center opacity-60">
              <Info size={14} />
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Sistem akan memindahkan siswa secara otomatis
              </p>
            </div>
          </div>
        }
      >
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {promotions.map((promo, idx) => (
              <div
                key={idx}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[1rem] border border-slate-200 bg-white hover:bg-slate-50 hover:border-orange-200 shadow-sm transition-all gap-3 sm:gap-0"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors truncate">
                    {promo.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Usia {promo.age} Thn
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 bg-slate-50 p-2 rounded-[1rem] border border-slate-100 group-hover:border-orange-100 transition-colors">
                  <ArrowRight
                    size={14}
                    className="text-slate-400 group-hover:text-orange-500 transition-colors"
                  />
                  <span
                    className={`text-xs font-bold ${
                      !promo.targetClassId ? "text-amber-600" : "text-green-600"
                    }`}
                  >
                    {promo.targetClassName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </AppModal>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-[1rem] border border-slate-200 p-8 shadow-xl max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-orange-50 rounded-[1rem] text-orange-600 border border-orange-100">
                <Users size={20} />
              </div>
              <AlertDialogTitle className="text-xl font-bold text-slate-800">
                Konfirmasi Mutasi Massal
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm font-medium text-slate-600 leading-relaxed">
              Sistem akan memproses perpindahan{" "}
              <span className="font-bold text-slate-900">
                {promotions.length} siswa
              </span>{" "}
              secara otomatis. <br />
              Siswa yang telah melewati batas maksimal usia sistem (Target:
              Alumni) akan dilepas dari kelas aktif. <br />
              <br />
              <span className="text-orange-600 font-bold">
                Lanjutkan proses eksekusi ini?
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-[1rem] border-slate-200 font-bold text-xs px-6 hover:bg-slate-50 text-slate-600 h-10">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleExecute}
              className="bg-slate-900 hover:bg-orange-600 text-white rounded-[1rem] font-bold text-xs px-6 shadow-sm border-none h-10 transition-colors"
            >
              Ya, Eksekusi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
