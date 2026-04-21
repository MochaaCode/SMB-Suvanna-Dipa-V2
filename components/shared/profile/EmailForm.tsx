/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { Mail, Save } from "lucide-react";
import { AppCard } from "../AppCard";
import { AppButton } from "../AppButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateOwnEmail } from "@/actions/shared/profile";
import toast from "react-hot-toast";

interface EmailFormProps {
  initialEmail: string | undefined;
}

export function EmailForm({ initialEmail }: EmailFormProps) {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState(initialEmail || "");

  const handleSaveEmail = () => {
    startTransition(async () => {
      const tid = toast.loading("Memproses email...");
      try {
        const res = await updateOwnEmail(email);
        toast.success(res.message, { id: tid });
      } catch (error: any) {
        toast.error(error.message, { id: tid });
      }
    });
  };

  return (
    <AppCard className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
          <Mail size={18} className="text-orange-600" />
          <h3 className="text-lg font-bold text-slate-800">
            Akses Login (Email)
          </h3>
        </div>
        <div className="space-y-2 mb-6">
          <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
            <Mail size={14} className="text-blue-500" /> Alamat Email Saat Ini
          </Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-lg border-slate-200 bg-white font-medium focus-visible:ring-orange-500 shadow-sm"
          />
          <p className="text-[11px] text-slate-500 font-medium">
            *Konfirmasi akan dikirim ke email baru jika diubah.
          </p>
        </div>
      </div>
      <AppButton
        onClick={handleSaveEmail}
        disabled={isPending || email === initialEmail}
        isLoading={isPending}
        className="w-full h-11"
        leftIcon={<Save size={16} />}
      >
        Update Email Login
      </AppButton>
    </AppCard>
  );
}
