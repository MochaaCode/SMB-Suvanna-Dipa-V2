"use client";

import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { AppButton } from "../../../shared/AppButton";
import { Input } from "@/components/ui/input";

interface CoreValueItem {
  l: string;
  v: string;
}

interface CoreValuesFormProps {
  initialData: { items?: CoreValueItem[] };
  onSave: (
    section: string,
    payload: Partial<{ items: CoreValueItem[] }>,
  ) => void;
  isPending: boolean;
}

export function CoreValuesForm({
  initialData,
  onSave,
  isPending,
}: CoreValuesFormProps) {
  const [items, setItems] = useState<CoreValueItem[]>(initialData?.items || []);

  const addItem = () => setItems([...items, { l: "", v: "" }]);
  const updateItem = (index: number, field: "l" | "v", value: string) => {
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
          <h3 className="text-xl font-bold text-slate-800">Core Values</h3>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
            Nilai-nilai dasar (F.R.I.E.N.D.L.Y) SMB Suvanna Dipa.
          </p>
        </div>
        <AppButton
          variant="secondary"
          onClick={addItem}
          leftIcon={<Plus size={16} />}
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 bg-white border border-slate-200 h-10 shrink-0"
        >
          Tambah Value
        </AppButton>
      </div>

      <div className="space-y-4 max-w-4xl">
        {items.length === 0 && (
          <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-slate-400 font-semibold text-sm">
            Belum ada Core Values
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-200 group hover:border-orange-200 transition-colors"
            >
              <div className="space-y-1.5 w-20 shrink-0">
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  Huruf
                </label>
                <Input
                  value={item.l}
                  onChange={(e) =>
                    updateItem(index, "l", e.target.value.toUpperCase())
                  }
                  placeholder="F"
                  maxLength={2}
                  className="h-10 text-center font-bold text-lg text-orange-600 rounded-lg border-slate-200 focus-visible:ring-orange-500 shadow-sm uppercase"
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  Kepanjangan (Value)
                </label>
                <div className="flex gap-2">
                  <Input
                    value={item.v}
                    onChange={(e) => updateItem(index, "v", e.target.value)}
                    placeholder="Faith"
                    className="h-10 rounded-lg border-slate-200 focus-visible:ring-orange-500 font-semibold shadow-sm"
                  />
                  <AppButton
                    variant="secondary"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="h-10 w-10 shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-600 border border-slate-200 bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </AppButton>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <AppButton
            onClick={() => onSave("values", { items })}
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
