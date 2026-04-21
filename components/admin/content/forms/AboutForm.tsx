"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { AppButton } from "../../../shared/AppButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AboutData {
  description: string;
  active_students: number;
  founded_year: number;
}

interface AboutFormProps {
  initialData: Partial<AboutData>;
  onSave: (section: string, payload: Partial<AboutData>) => void;
  isPending: boolean;
}

export function AboutForm({ initialData, onSave, isPending }: AboutFormProps) {
  const [data, setData] = useState<AboutData>({
    description: initialData?.description || "",
    active_students: initialData?.active_students || 0,
    founded_year: initialData?.founded_year || 2004,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-bold text-slate-800">Tentang Kami</h3>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
          Kelola narasi utama, jumlah murid, dan tahun berdiri.
        </p>
      </div>

      <div className="space-y-5 max-w-4xl">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
            Deskripsi Utama
          </label>
          <Textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            className="min-h-35 rounded-lg border-slate-200 focus-visible:ring-orange-500 font-medium text-sm p-4 shadow-sm"
            placeholder="Tuliskan penjelasan mengenai SMB Suvanna Dipa..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Jumlah Murid Aktif
            </label>
            <Input
              type="number"
              value={data.active_students}
              onChange={(e) =>
                setData({
                  ...data,
                  active_students: parseInt(e.target.value) || 0,
                })
              }
              className="h-11 rounded-lg border-slate-200 focus-visible:ring-orange-500 font-semibold text-slate-800 shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Tahun Berdiri
            </label>
            <Input
              type="number"
              value={data.founded_year}
              onChange={(e) =>
                setData({
                  ...data,
                  founded_year: parseInt(e.target.value) || 0,
                })
              }
              className="h-11 rounded-lg border-slate-200 focus-visible:ring-orange-500 font-semibold text-slate-800 shadow-sm"
            />
          </div>
        </div>

        <div className="pt-4">
          <AppButton
            onClick={() => onSave("about", data)}
            isLoading={isPending}
            leftIcon={<Save size={16} />}
            className="h-11"
          >
            Simpan Perubahan
          </AppButton>
        </div>
      </div>
    </div>
  );
}
