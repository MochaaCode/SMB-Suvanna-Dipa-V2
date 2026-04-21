"use client";

import { useState } from "react";
import { Save, MessageCircle, Earth, Mail, MapPin } from "lucide-react";
import { AppButton } from "../../../shared/AppButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactData {
  whatsapp: string;
  instagram: string;
  email: string;
  map_url: string;
}

interface ContactFormProps {
  initialData: Partial<ContactData>;
  onSave: (section: string, payload: Partial<ContactData>) => void;
  isPending: boolean;
}

export function ContactForm({
  initialData,
  onSave,
  isPending,
}: ContactFormProps) {
  const [data, setData] = useState<ContactData>({
    whatsapp: initialData?.whatsapp || "",
    instagram: initialData?.instagram || "",
    email: initialData?.email || "",
    map_url: initialData?.map_url || "",
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-bold text-slate-800">Kontak & Lokasi</h3>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
          Kelola tautan sosial media dan sematan (embed) peta lokasi vihara.
        </p>
      </div>

      <div className="space-y-5 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <MessageCircle size={14} /> WhatsApp
            </label>
            <Input
              value={data.whatsapp}
              onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
              placeholder="Contoh: 628123456789"
              className="h-11 rounded-lg border-slate-200 focus-visible:ring-orange-500 font-medium shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Earth size={14} /> Instagram Username
            </label>
            <Input
              value={data.instagram}
              onChange={(e) => setData({ ...data, instagram: e.target.value })}
              placeholder="Contoh: smbsuvannadipa"
              className="h-11 rounded-lg border-slate-200 focus-visible:ring-orange-500 font-medium shadow-sm"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Mail size={14} /> Alamat Email
            </label>
            <Input
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder="Contoh: hello@smbsuvannadipa.com"
              className="h-11 rounded-lg border-slate-200 focus-visible:ring-orange-500 font-medium shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
            <MapPin size={14} /> Google Maps Embed URL
          </label>
          <Textarea
            value={data.map_url}
            onChange={(e) => setData({ ...data, map_url: e.target.value })}
            placeholder="Masukkan link embed src dari Google Maps (https://www.google.com/maps/embed?...)"
            className="min-h-25 rounded-lg border-slate-200 focus-visible:ring-orange-500 font-mono text-sm p-4 shadow-sm"
          />
        </div>

        <div className="pt-4">
          <AppButton
            onClick={() => onSave("contact", data)}
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
