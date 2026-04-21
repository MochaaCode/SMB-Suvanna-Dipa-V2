"use client";

import { useState, useTransition, useEffect } from "react";
import { AppModal } from "../../shared/AppModal";
import { AppButton } from "../../shared/AppButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Radio } from "lucide-react";
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

  // ========================================================
  // IOT SAFETY MECHANISM: Kontrol Mode Alat Scanner
  // ========================================================
  useEffect(() => {
    if (open) {
      // Alat otomatis jadi mode Pendaftaran saat modal terbuka
      toggleDeviceMode("register").catch(console.error);
    } else {
      // Alat kembali ke mode Absensi saat modal ditutup
      toggleDeviceMode("scan").catch(console.error);
    }

    // Cleanup function: Jaga-jaga kalau komponen tiba-tiba hancur/pindah halaman
    return () => {
      toggleDeviceMode("scan").catch(console.error);
    };
  }, [open]);
  // ========================================================

  const handleAdd = () => {
    const cleanUid = uid.trim().toUpperCase();
    if (!cleanUid || cleanUid.length < 4) {
      return toast.error("UID minimal 4 karakter!");
    }

    startTransition(async () => {
      try {
        await registerNewCard(cleanUid);
        toast.success(`UID ${cleanUid} berhasil didaftarkan!`);
        setUid("");
        setOpen(false);
        router.refresh();
      } catch (error: unknown) {
        toast.error((error as Error).message);
      }
    });
  };

  return (
    <AppModal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Registrasi Kartu Fisik"
      description="Daftarkan kartu RFID baru agar dapat dipasangkan dengan pengguna."
      variant="orange"
      maxWidth="sm"
      footer={
        <div className="w-full flex justify-end gap-3">
          <AppButton
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Batal
          </AppButton>
          <AppButton
            onClick={handleAdd}
            disabled={isPending || !uid}
            isLoading={isPending}
            leftIcon={<Save size={16} />}
          >
            Simpan Kartu
          </AppButton>
        </div>
      }
    >
      <div className="space-y-4 text-left">
        {/* INDIKATOR IOT */}
        <div className="flex items-center gap-2 bg-blue-50 text-blue-600 p-3 rounded-lg border border-blue-100">
          <Radio size={16} className="animate-pulse" />
          <p className="text-[11px] font-bold uppercase tracking-wider">
            Alat Scanner dalam mode pendaftaran
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Input UID RFID
          </Label>
          <Input
            placeholder="Contoh: A1B2C3D4"
            value={uid}
            onChange={(event) => setUid(event.target.value.toUpperCase())}
            className="h-11 font-mono font-bold uppercase border-slate-200 focus-visible:ring-orange-500"
          />
        </div>
        <p className="text-[11px] font-medium text-slate-500 leading-relaxed bg-orange-50 p-3 rounded-lg border border-orange-100">
          *Tempelkan kartu ke alat scanner, atau ketik manual UID di atas.
          Status awal kartu akan otomatis diatur menjadi <b>TERSEDIA</b>.
        </p>
      </div>
    </AppModal>
  );
}
