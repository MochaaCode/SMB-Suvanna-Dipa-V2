/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { AppButton } from "../../../shared/AppButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface MilestoneItem {
  title: string;
  desc: string;
}

interface MilestoneFormProps {
  initialData: { items?: any[] };
  onSave: (
    section: string,
    payload: Partial<{ items: MilestoneItem[] }>,
  ) => void;
  isPending: boolean;
}

export function MilestoneForm({
  initialData,
  onSave,
  isPending,
}: MilestoneFormProps) {
  const [items, setItems] = useState<MilestoneItem[]>(
    (initialData?.items || []).map(({ title, desc }: any) => ({
      title: title || "",
      desc: desc || "",
    })),
  );

  const addItem = () => setItems([{ title: "", desc: "" }, ...items]);

  const updateItem = (
    index: number,
    field: keyof MilestoneItem,
    value: string,
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Kegiatan Dharma</h3>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
            Kegiatan rutin dan hari besar (Waisak, Kathina, dll). Kelola judul &
            deskripsi.
          </p>
        </div>
        <AppButton
          variant="secondary"
          onClick={addItem}
          leftIcon={<Plus size={16} />}
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 bg-white border border-slate-200 h-10 shrink-0"
        >
          Tambah Kegiatan
        </AppButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-150 overflow-y-auto pr-3 custom-scrollbar">
        {items.length === 0 && (
          <div className="col-span-full text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 font-semibold text-sm">
            Belum ada data kegiatan
          </div>
        )}

        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 p-5 rounded-[1rem] flex flex-col gap-4 group hover:border-orange-300 transition-colors relative shadow-sm"
          >
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="absolute top-3 right-3 p-2 bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-50 hover:text-red-600 transition-all border border-slate-200 opacity-0 group-hover:opacity-100 z-10"
            >
              <Trash2 size={14} />
            </button>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                Judul Kegiatan
              </label>
              <Input
                value={item.title}
                onChange={(e) => updateItem(index, "title", e.target.value)}
                placeholder="Contoh: Waisak"
                className="h-10 rounded-lg border-slate-200 font-bold focus-visible:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                Deskripsi Singkat
              </label>
              <Textarea
                value={item.desc}
                onChange={(e) => updateItem(index, "desc", e.target.value)}
                placeholder="Contoh: Peringatan Hari Trisuci Waisak..."
                className="min-h-20 rounded-lg border-slate-200 font-medium text-sm focus-visible:ring-orange-500 resize-none"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <AppButton
          onClick={() => onSave("milestone", { items })}
          isLoading={isPending}
          leftIcon={<Save size={16} />}
          className="h-11"
        >
          Simpan Perubahan
        </AppButton>
      </div>
    </div>
  );
}
