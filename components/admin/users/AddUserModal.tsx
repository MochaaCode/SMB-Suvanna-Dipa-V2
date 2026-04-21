/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { AppModal } from "../../shared/AppModal";
import { AppButton } from "../../shared/AppButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as XLSX from "xlsx";
import { Upload, Mail, User } from "lucide-react";
import toast from "react-hot-toast";

import type { BulkUserPayload } from "@/actions/admin/users";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataExtracted: (data: BulkUserPayload[]) => void;
}

export function AddUserModal({
  isOpen,
  onClose,
  onDataExtracted,
}: AddUserModalProps) {
  const [loading, setLoading] = useState(false);

  const getFirstName = (name: string) =>
    name.trim().split(" ")[0].toLowerCase();

  const formatBirthDateForPass = (val: string | number | null | undefined) => {
    if (!val || val === "NULL") return "123";
    if (typeof val === "number") {
      // Menangani format tanggal angka dari Excel (Serial Date)
      const d = new Date(Math.round((val - 25569) * 86400 * 1000));
      return d.toISOString().split("T")[0].replace(/-/g, "");
    }
    // Menangani string tanggal (YYYY-MM-DD) menjadi YYYYMMDD
    return String(val).replace(/-/g, "");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const tid = toast.loading("Membaca file Excel/CSV...");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        const extracted: BulkUserPayload[] = data.map((row) => {
          // Mengambil header dari file CSV (full_name, birth_date, dll)
          const fullName = row["full_name"] || "NULL";
          const firstName =
            fullName !== "NULL" ? getFirstName(fullName) : "user";
          const birthDate = row["birth_date"];

          // FORMAT BARU: namadepan@smb.test (Tanpa angka random)
          const generatedEmail = `${firstName}@smb.test`;

          // FORMAT BARU: namadepan.YYYYMMDD
          const generatedPassword = `${firstName}.${formatBirthDateForPass(birthDate)}`;

          return {
            email: generatedEmail,
            password: generatedPassword,
            full_name: fullName,
            buddhist_name: row["buddhist_name"] || "NULL",
            gender: row["gender"] || "NULL",
            birth_place: row["birth_place"] || "NULL",
            birth_date: birthDate || "NULL",
            address: row["address"] || "NULL",
            phone_number: row["phone_number"] || "NULL",
            parent_name: row["parent_name"] || "NULL",
            parent_phone_number: row["parent_phone_number"] || "NULL",
            school_name: row["school_name"] || "NULL",
            hobby: row["hobby"] || "NULL",
            role: row["role"] || "siswa",
            points: Number(row["points"]) || 0,
          };
        });

        toast.success(`Berhasil mengekstrak ${extracted.length} data!`, {
          id: tid,
        });
        onDataExtracted(extracted);
      } catch (error: any) {
        toast.error("Gagal membaca file: " + error.message, { id: tid });
      } finally {
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleManualSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = getFirstName(formData.get("full_name") as string);
    // Manual juga mengikuti pola namadepan.123 jika tidak ada tanggal lahir
    const defaultPassword = `${firstName}.123`;

    const newUser: BulkUserPayload = {
      email: formData.get("email") as string,
      password: defaultPassword,
      full_name: formData.get("full_name") as string,
      role: formData.get("role") as any,
      points: Number(formData.get("points")),
    };

    onDataExtracted([newUser]);
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Pengguna Baru"
      description="Gunakan file Excel atau CSV dengan header sistem (full_name, birth_date, dll)."
      variant="orange"
      maxWidth="xl"
    >
      <Tabs defaultValue="excel" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-lg mb-6">
          <TabsTrigger
            value="excel"
            className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
          >
            Import Excel / CSV
          </TabsTrigger>
          <TabsTrigger
            value="manual"
            className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
          >
            Input Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="excel" className="space-y-4 outline-none">
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative group">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-full group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Klik atau Tarik File Anda
                </p>
                <p className="text-[11px] font-medium text-slate-500 mt-1">
                  Email dan Password akan dibuat otomatis sesuai format sistem.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
            <p className="text-[11px] font-semibold text-orange-800 leading-relaxed text-left">
              <strong>Format Password:</strong> namadepan.YYYYMMDD (Contoh:
              budi.20101231)
              <br />
              <strong>Format Email:</strong> namadepan@smb.test
            </p>
          </div>
        </TabsContent>

        <TabsContent value="manual" className="outline-none">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-4 text-left">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={14} /> Nama Lengkap
                </Label>
                <Input
                  name="full_name"
                  required
                  placeholder="Masukkan nama..."
                  className="h-11 rounded-lg border-slate-200 bg-white font-medium focus-visible:ring-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail size={14} /> Email Login
                </Label>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="user@smb.test"
                  className="h-11 rounded-lg border-slate-200 bg-white font-medium focus-visible:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Role Akses
                  </Label>
                  <Select name="role" defaultValue="siswa">
                    <SelectTrigger className="h-11 rounded-lg border-slate-200 bg-white font-medium text-sm focus:ring-orange-500">
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
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Poin Awal
                  </Label>
                  <Input
                    name="points"
                    type="number"
                    defaultValue="0"
                    className="h-11 rounded-lg border-slate-200 bg-white font-bold focus-visible:ring-orange-500"
                  />
                </div>
              </div>
            </div>
            <AppButton
              type="submit"
              isLoading={loading}
              className="w-full h-11 mt-6"
            >
              Daftarkan Pengguna
            </AppButton>
          </form>
        </TabsContent>
      </Tabs>
    </AppModal>
  );
}
