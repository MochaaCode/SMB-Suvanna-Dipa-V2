/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { Key, ShieldCheck } from "lucide-react";
import { AppCard } from "../AppCard";
import { AppButton } from "../AppButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateOwnPassword } from "@/actions/shared/profile";
import toast from "react-hot-toast";

export function PasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [passData, setPassData] = useState({
    newPass: "",
    confirmPass: "",
  });

  const handleSavePass = () => {
    if (passData.newPass !== passData.confirmPass) {
      return toast.error("Konfirmasi password tidak cocok!");
    }
    if (passData.newPass.length < 6) {
      return toast.error("Password minimal 6 karakter!");
    }

    startTransition(async () => {
      const tid = toast.loading("Mengubah kata sandi...");
      try {
        await updateOwnPassword(passData.newPass);
        toast.success("Sandi berhasil diubah!", { id: tid });
        setPassData({ newPass: "", confirmPass: "" });
      } catch (error: any) {
        toast.error(error.message, { id: tid });
      }
    });
  };

  return (
    <AppCard className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
          <ShieldCheck size={18} className="text-orange-600" />
          <h3 className="text-lg font-bold text-slate-800">Proteksi Sandi</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Key size={14} className="text-orange-500" /> Sandi Baru
            </Label>
            <Input
              type="password"
              placeholder="••••••"
              value={passData.newPass}
              onChange={(e) =>
                setPassData((p) => ({ ...p, newPass: e.target.value }))
              }
              className="h-11 rounded-lg border-slate-200 bg-white font-medium focus-visible:ring-orange-500 shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-orange-500" /> Konfirmasi
            </Label>
            <Input
              type="password"
              placeholder="••••••"
              value={passData.confirmPass}
              onChange={(e) =>
                setPassData((p) => ({ ...p, confirmPass: e.target.value }))
              }
              className="h-11 rounded-lg border-slate-200 bg-white font-medium focus-visible:ring-orange-500 shadow-sm"
            />
          </div>
        </div>
      </div>
      <AppButton
        variant="default"
        onClick={handleSavePass}
        disabled={isPending || !passData.newPass}
        isLoading={isPending}
        className="w-full h-11"
        leftIcon={<Key size={16} />}
      >
        Ganti Kata Sandi
      </AppButton>
    </AppCard>
  );
}
