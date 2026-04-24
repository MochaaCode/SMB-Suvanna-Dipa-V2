/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition, useEffect } from "react";
import { AppModal } from "../../shared/AppModal";
import { AppButton } from "../../shared/AppButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Radio, Fingerprint, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { registerNewCard } from "@/actions/admin/cards";
import { toggleDeviceMode } from "@/actions/admin/device";

interface AddCardModalProps {
  open: boolean;
  setOpen: (isOpenState: boolean) => void;
}

export function AddCardModal({ open, setOpen }: AddCardModalProps) {
  const [uid, setUid] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (open) {
      toggleDeviceMode("register").catch(console.error);
    } else {
      toggleDeviceMode("scan").catch(console.error);
    }
    return () => {
      toggleDeviceMode("scan").catch(console.error);
    };
  }, [open]);

  const handleAdd = () => {
    if (!uid) return toast.error("UID kartu tidak boleh kosong!");

    startTransition(async () => {
      const tid = toast.loading("Mendaftarkan kartu ke database...");
      try {
        await registerNewCard(uid.toUpperCase());
        toast.success(`Kartu ${uid} berhasil terdaftar!`, { id: tid });
        setUid("");
        setOpen(false);
        router.refresh();
      } catch (err: any) {
        toast.error(err.message, { id: tid });
      }
    });
  };

  return (
    <AppModal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Registrasi Kartu Baru"
      description="Daftarkan identitas fisik kartu RFID ke dalam inventaris sistem."
      variant="orange"
      maxWidth="md"
      footer={
        <div className="flex w-full gap-3">
          <AppButton
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1 rounded-[1rem]"
          >
            Batal
          </AppButton>
          <AppButton
            onClick={handleAdd}
            disabled={isPending || !uid}
            isLoading={isPending}
            leftIcon={<Save size={16} />}
            className="flex-1 rounded-[1rem]"
          >
            Simpan Kartu
          </AppButton>
        </div>
      }
    >
      <div className="space-y-6 text-left mt-2">
        <div className="flex items-center gap-4 bg-orange-50/50 p-4 rounded-[1rem] border border-orange-100">
          <div className="relative flex shrink-0">
            <Radio size={24} className="text-orange-600 animate-pulse" />
            <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">
              Scanner Aktif
            </p>
            <p className="text-[11px] font-medium text-orange-800 leading-tight">
              Silakan tempelkan kartu pada alat atau input UID secara manual.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Fingerprint size={14} className="text-slate-400" /> Unique ID (UID)
          </Label>
          <Input
            placeholder="CONTOH: A1B2C3D4"
            value={uid}
            onChange={(e) => setUid(e.target.value.toUpperCase())}
            className="h-12 font-mono text-lg font-black uppercase tracking-widest border-slate-200 focus-visible:ring-orange-500 rounded-[1rem] text-center bg-slate-50"
          />
        </div>

        <div className="flex items-start gap-2.5 p-4 bg-slate-50 rounded-[1rem] border border-slate-100">
          <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
            Sistem akan menolak jika UID sudah terdaftar sebelumnya. Pastikan
            alat scanner berada dalam jangkauan sinyal internet yang stabil.
          </p>
        </div>
      </div>
    </AppModal>
  );
}
