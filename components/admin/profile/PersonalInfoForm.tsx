/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Save,
  User,
  Phone,
  MapPin,
  GraduationCap,
  Heart,
  Calendar,
  Baby,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppCard } from "../../shared/AppCard";
import { AppButton } from "../../shared/AppButton";

import type { OwnProfileData } from "@/actions/shared/profile";

interface PersonalInfoFormProps {
  data: OwnProfileData;
  onChange: (key: keyof OwnProfileData, value: string) => void;
  onSave: () => void;
  isPending: boolean;
}

export function PersonalInfoForm({
  data,
  onChange,
  onSave,
  isPending,
}: PersonalInfoFormProps) {
  const fields: Array<{
    id: keyof OwnProfileData;
    label: string;
    icon: any;
    type: string;
  }> = [
    { id: "full_name", label: "Nama Lengkap", icon: User, type: "text" },
    { id: "phone_number", label: "No WhatsApp", icon: Phone, type: "text" },
    { id: "birth_place", label: "Tempat Lahir", icon: MapPin, type: "text" },
    { id: "birth_date", label: "Tgl Lahir", icon: Calendar, type: "date" },
    { id: "parent_name", label: "Nama Ortu", icon: Baby, type: "text" },
    { id: "parent_phone_number", label: "WA Ortu", icon: Phone, type: "text" },
    {
      id: "school_name",
      label: "Asal Sekolah",
      icon: GraduationCap,
      type: "text",
    },
    { id: "hobby", label: "Hobi", icon: Heart, type: "text" },
  ];

  return (
    <AppCard className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <h3 className="text-lg font-bold text-slate-800">
          Data Identitas Personal
        </h3>
        <AppButton
          onClick={onSave}
          isLoading={isPending}
          leftIcon={<Save size={16} />}
        >
          Simpan Perubahan
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
              className="h-11 rounded-lg border-slate-200 bg-white font-medium focus-visible:ring-orange-500 shadow-sm"
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
            <SelectTrigger className="h-11 rounded-lg border-slate-200 bg-white font-medium text-sm focus:ring-orange-500 shadow-sm">
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
          </Label>
          <Input
            value={data.address || ""}
            onChange={(event) => onChange("address", event.target.value)}
            className="h-11 rounded-lg border-slate-200 bg-white font-medium focus-visible:ring-orange-500 shadow-sm"
          />
        </div>
      </div>
    </AppCard>
  );
}
