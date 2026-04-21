"use client";

import { useState } from "react";
import { Save, Plus, Trash2, MessageCircleHeart } from "lucide-react";
import { AppButton } from "../../../shared/AppButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TestimonialItem {
  name: string;
  role: string;
  text: string;
}

interface TestimonialFormProps {
  initialData: { items?: TestimonialItem[] };
  onSave: (
    section: string,
    payload: Partial<{ items: TestimonialItem[] }>,
  ) => void;
  isPending: boolean;
}

export function TestimonialForm({
  initialData,
  onSave,
  isPending,
}: TestimonialFormProps) {
  const [items, setItems] = useState<TestimonialItem[]>(
    initialData?.items || [],
  );

  const addItem = () => setItems([{ name: "", role: "", text: "" }, ...items]);
  const updateItem = (
    index: number,
    field: keyof TestimonialItem,
    value: string,
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };
  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Testimoni</h3>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
            Ulasan dari orang tua dan siswa SMB.
          </p>
        </div>
        <AppButton
          variant="secondary"
          onClick={addItem}
          leftIcon={<Plus size={16} />}
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 bg-white border border-slate-200 h-10 shrink-0"
        >
          Tambah Ulasan
        </AppButton>
      </div>

      <div className="grid grid-cols-1 gap-5 max-h-150 overflow-y-auto pr-3 custom-scrollbar">
        {items.length === 0 && (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 font-semibold text-sm">
            Belum ada testimoni
          </div>
        )}

        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 p-5 rounded-[1rem] flex flex-col md:flex-row gap-5 group hover:border-orange-300 transition-colors relative shadow-sm"
          >
            <AppButton
              size="icon"
              variant="secondary"
              onClick={() => removeItem(index)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-600 hover:bg-red-50 bg-white border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <Trash2 size={14} />
            </AppButton>

            <div className="flex-1 space-y-4 pr-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                    Nama Lengkap
                  </label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    placeholder="Ibu Shanti"
                    className="h-11 rounded-lg border-slate-200 font-bold focus-visible:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                    Status / Role
                  </label>
                  <Input
                    value={item.role}
                    onChange={(e) => updateItem(index, "role", e.target.value)}
                    placeholder="Orang Tua Siswa"
                    className="h-11 rounded-lg border-slate-200 font-bold focus-visible:ring-orange-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <MessageCircleHeart size={14} /> Isi Ulasan
                </label>
                <Textarea
                  value={item.text}
                  onChange={(e) => updateItem(index, "text", e.target.value)}
                  placeholder="Sistem absensi digitalnya keren banget..."
                  className="min-h-25 rounded-lg border-slate-200 font-medium text-sm focus-visible:ring-orange-500 resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <AppButton
          onClick={() => onSave("testimonial", { items })}
          isLoading={isPending}
          leftIcon={<Save size={16} />}
          className="h-11"
        >
          Simpan Perubahan Testimoni
        </AppButton>
      </div>
    </div>
  );
}
