"use client";

import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { AppButton } from "../../../shared/AppButton";
import { Textarea } from "@/components/ui/textarea";

interface VisionData {
  visi: string;
  misi: string[];
}

interface VisionFormProps {
  initialData: Partial<VisionData>;
  onSave: (section: string, payload: Partial<VisionData>) => void;
  isPending: boolean;
}

export function VisionForm({
  initialData,
  onSave,
  isPending,
}: VisionFormProps) {
  const [visi, setVisi] = useState(initialData?.visi || "");
  const [misiList, setMisiList] = useState<string[]>(initialData?.misi || []);

  const addMisi = () => setMisiList([...misiList, ""]);
  const updateMisi = (index: number, val: string) => {
    const newMisi = [...misiList];
    newMisi[index] = val;
    setMisiList(newMisi);
  };
  const removeMisi = (index: number) =>
    setMisiList(misiList.filter((_, i) => i !== index));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Visi & Misi</h3>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
            Atur tujuan utama dan langkah strategis vihara.
          </p>
        </div>
        <AppButton
          variant="secondary"
          onClick={addMisi}
          leftIcon={<Plus size={16} />}
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 bg-white border border-slate-200 h-10 shrink-0"
        >
          Tambah Misi
        </AppButton>
      </div>

      <div className="space-y-6 max-w-4xl">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
            Visi Utama
          </label>
          <Textarea
            value={visi}
            onChange={(e) => setVisi(e.target.value)}
            className="min-h-25 rounded-xl border-slate-200 focus-visible:ring-orange-500 font-medium text-sm p-4 shadow-sm"
            placeholder="Menjadi wadah pelayanan terpadu..."
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
            Daftar Misi
          </label>
          {misiList.length === 0 && (
            <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-400 font-semibold text-sm">
              Belum ada data misi
            </div>
          )}
          {misiList.map((misi, index) => (
            <div key={index} className="flex gap-3 items-start group">
              <div className="h-11 w-11 shrink-0 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 text-sm border border-slate-200">
                {index + 1}
              </div>
              <Textarea
                value={misi}
                onChange={(e) => updateMisi(index, e.target.value)}
                className="min-h-20 rounded-lg border-slate-200 focus-visible:ring-orange-500 font-medium text-sm shadow-sm"
                placeholder="Tuliskan penjabaran misi..."
              />
              <AppButton
                variant="secondary"
                size="icon"
                onClick={() => removeMisi(index)}
                className="h-11 w-11 shrink-0 text-slate-400 hover:text-red-600 hover:bg-red-50 bg-white border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </AppButton>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <AppButton
            onClick={() => onSave("vision", { visi, misi: misiList })}
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
