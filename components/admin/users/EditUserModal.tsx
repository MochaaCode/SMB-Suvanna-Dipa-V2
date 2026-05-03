/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { AppModal } from "../../shared/AppModal";
import { AppButton } from "../../shared/AppButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { upsertUser } from "@/actions/admin/users";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Phone,
  Home,
  GraduationCap,
  School,
  Heart,
  Baby,
  Calendar,
  MapPin,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

import type { ProfileWithEmailAndClass } from "@/app/(admin)/admin/users/page";
import type { Class, Profile } from "@/types";

interface EditUserModalProps {
  user: ProfileWithEmailAndClass | null;
  isOpen: boolean;
  onClose: () => void;
  classes: Class[];
}

export function EditUserModal({
  user,
  isOpen,
  onClose,
  classes = [],
}: EditUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  useEffect(() => {
    if (user) {
      const { classes: _, email: __, ...cleanData } = user;
      setFormData(cleanData);
    }
  }, [user]);

  const handleChange = (key: keyof Profile, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const tid = toast.loading("Menyimpan pembaruan profil...");
    try {
      await upsertUser(formData);
      toast.success("Profil berhasil diperbarui!", { id: tid });
      onClose();
    } catch (error: any) {
      toast.error(error.message, { id: tid });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profil Pengguna"
      description={`Memperbarui data profil untuk ${user.full_name}`}
      variant="orange"
      maxWidth="xl"
      footer={
        <div className="w-full flex justify-end gap-3">
          <AppButton
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="rounded-[1rem]"
          >
            Batal
          </AppButton>
          <AppButton
            onClick={handleSave}
            isLoading={loading}
            leftIcon={<Save size={16} />}
            className="rounded-[1rem]"
          >
            Simpan Perubahan
          </AppButton>
        </div>
      }
    >
      <Tabs defaultValue="pribadi" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-[1rem] mb-4">
          <TabsTrigger
            value="pribadi"
            className="text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-[0.8rem] transition-all"
          >
            Pribadi
          </TabsTrigger>
          <TabsTrigger
            value="akademik"
            className="text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-[0.8rem] transition-all"
          >
            Sistem & Akademik
          </TabsTrigger>
          <TabsTrigger
            value="kontak"
            className="text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-[0.8rem] transition-all"
          >
            Kontak & Keluarga
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[55vh] pr-4">
          <TabsContent
            value="pribadi"
            className="space-y-5 text-left outline-none mt-2"
          >
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User size={14} /> Nama Lengkap
              </Label>
              <Input
                value={formData.full_name || ""}
                onChange={(e) => handleChange("full_name", e.target.value)}
                className="h-11 rounded-[1rem] border-slate-200 bg-white font-medium focus-visible:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Nama Buddhis
                </Label>
                <Input
                  value={formData.buddhist_name || ""}
                  onChange={(e) =>
                    handleChange("buddhist_name", e.target.value)
                  }
                  className="h-11 rounded-[1rem] border-slate-200 bg-white font-medium focus-visible:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Jenis Kelamin
                </Label>
                <Select
                  value={formData.gender || ""}
                  onValueChange={(val) => handleChange("gender", val)}
                >
                  <SelectTrigger className="h-11 rounded-[1rem] border-slate-200 bg-white font-medium text-sm focus:ring-orange-500">
                    <SelectValue placeholder="Pilih Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-Laki">Laki-Laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={14} /> Tempat Lahir
                </Label>
                <Input
                  value={formData.birth_place || ""}
                  onChange={(e) => handleChange("birth_place", e.target.value)}
                  className="h-11 rounded-[1rem] border-slate-200 bg-white font-medium focus-visible:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar size={14} /> Tanggal Lahir
                </Label>
                <Input
                  type="date"
                  value={formData.birth_date || ""}
                  onChange={(e) => handleChange("birth_date", e.target.value)}
                  className="h-11 rounded-[1rem] border-slate-200 bg-white font-medium focus-visible:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Heart size={14} /> Hobi
              </Label>
              <Input
                value={formData.hobby || ""}
                onChange={(e) => handleChange("hobby", e.target.value)}
                className="h-11 rounded-[1rem] border-slate-200 bg-white font-medium focus-visible:ring-orange-500"
              />
            </div>
          </TabsContent>

          <TabsContent
            value="akademik"
            className="space-y-5 text-left outline-none mt-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Peran Sistem
                </Label>
                <Select
                  value={formData.role || "siswa"}
                  onValueChange={(val) => handleChange("role", val)}
                >
                  <SelectTrigger className="h-11 rounded-[1rem] border-slate-200 bg-white font-semibold text-sm focus:ring-orange-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="siswa">Siswa</SelectItem>
                    <SelectItem value="pembina">Pembina</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap size={14} /> Penempatan Kelas
                </Label>
                <Select
                  value={formData.class_id?.toString() || "none"}
                  onValueChange={(val) =>
                    handleChange(
                      "class_id",
                      val === "none" ? null : parseInt(val),
                    )
                  }
                  disabled={
                    formData.role === "pembina" || formData.role === "admin"
                  }
                >
                  <SelectTrigger className="h-11 rounded-[1rem] border-slate-200 bg-white font-semibold text-sm disabled:bg-slate-100 disabled:text-slate-400 focus:ring-orange-500">
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      Tidak Ada Kelas / Alumni
                    </SelectItem>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <School size={14} /> Asal Sekolah
              </Label>
              <Input
                value={formData.school_name || ""}
                onChange={(e) => handleChange("school_name", e.target.value)}
                className="h-11 rounded-[1rem] border-slate-200 bg-white font-medium focus-visible:ring-orange-500"
              />
            </div>
          </TabsContent>

          <TabsContent
            value="kontak"
            className="space-y-5 text-left outline-none mt-2"
          >
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Phone size={14} /> No WhatsApp Personal
              </Label>
              <Input
                value={formData.phone_number || ""}
                onChange={(e) => handleChange("phone_number", e.target.value)}
                className="h-11 rounded-[1rem] border-slate-200 bg-white font-medium focus-visible:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-200 pt-5 mt-2">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Baby size={14} /> Nama Orang Tua / Wali
                </Label>
                <Input
                  value={formData.parent_name || ""}
                  onChange={(e) => handleChange("parent_name", e.target.value)}
                  className="h-11 rounded-[1rem] border-slate-200 bg-white font-medium focus-visible:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone size={14} /> WhatsApp Wali
                </Label>
                <Input
                  value={formData.parent_phone_number || ""}
                  onChange={(e) =>
                    handleChange("parent_phone_number", e.target.value)
                  }
                  className="h-11 rounded-[1rem] border-slate-200 bg-white font-medium focus-visible:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-200 pt-5 mt-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Home size={14} /> Alamat Lengkap
              </Label>
              <Textarea
                value={formData.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                className="rounded-[1rem] border-slate-200 bg-white font-medium min-h-25 resize-none focus-visible:ring-orange-500"
              />
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </AppModal>
  );
}
