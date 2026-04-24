/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Save, User, Phone, MapPin, Calendar, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppCard } from "@/components/shared/AppCard";
import { AppButton } from "@/components/shared/AppButton";
import type { OwnProfileData } from "@/actions/shared/profile";

interface PembinaPersonalInfoFormProps {
  data: OwnProfileData;
  onChange: (key: keyof OwnProfileData, value: string) => void;
  onSave: () => void;
  isPending: boolean;
}

export function PembinaPersonalInfoForm({
  data,
  onChange,
  onSave,
  isPending,
}: PembinaPersonalInfoFormProps) {
  // Daftar field untuk Pembina (Tanpa data sekolah/orang tua)
  const fields: Array<{
    id: keyof OwnProfileData;
    label: string;
    icon: any;
    type: string;
  }> = [
    { id: "full_name", label: "Nama Lengkap", icon: User, type: "text" },
    { id: "buddhist_name", label: "Nama Buddhis", icon: Smile, type: "text" },
    { id: "phone_number", label: "No WhatsApp", icon: Phone, type: "text" },
    { id: "birth_place", label: "Tempat Lahir", icon: MapPin, type: "text" },
    { id: "birth_date", label: "Tgl Lahir", icon: Calendar, type: "date" },
  ];

  return (
    <AppCard className="space-y-6 border-slate-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-800">Biodata Pembina</h3>
        <AppButton
          onClick={onSave}
          isLoading={isPending}
          leftIcon={<Save size={16} />}
          variant="orange"
        >
          Simpan Identitas
        </AppButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 text-left">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <field.icon size={14} className="text-orange-500" /> {field.label}
            </Label>
            <Input
              type={field.type}
              value={(data[field.id] as string) || ""}
              onChange={(event) => onChange(field.id, event.target.value)}
              className="h-11 rounded-lg border-slate-200 bg-slate-50 font-medium focus-visible:ring-orange-500 focus-visible:bg-white transition-colors shadow-none"
            />
          </div>
        ))}

        <div className="space-y-2 text-left">
          <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
            <User size={14} className="text-orange-500" /> Jenis Kelamin
          </Label>
          <Select
            value={data.gender || ""}
            onValueChange={(value) => onChange("gender", value)}
          >
            <SelectTrigger className="h-11 rounded-lg border-slate-200 bg-slate-50 font-medium text-sm focus:ring-orange-500 shadow-none">
              <SelectValue placeholder="Pilih Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Laki-Laki">Laki-Laki</SelectItem>
              <SelectItem value="Perempuan">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2 lg:col-span-2 text-left">
          <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
            <MapPin size={14} className="text-orange-500" /> Alamat Lengkap
            Domisili
          </Label>
          <Input
            value={data.address || ""}
            onChange={(event) => onChange("address", event.target.value)}
            className="h-11 rounded-lg border-slate-200 bg-slate-50 font-medium focus-visible:ring-orange-500 focus-visible:bg-white transition-colors shadow-none"
          />
        </div>
      </div>
    </AppCard>
  );
}
