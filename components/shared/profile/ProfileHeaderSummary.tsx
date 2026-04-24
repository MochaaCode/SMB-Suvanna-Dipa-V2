"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Loader2, UserCog, UserCheck, User } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppCard } from "@/components/shared/AppCard";

interface ProfileHeaderSummaryProps {
  avatarUrl: string | null;
  fullName: string | null;
  role: string;
  isUploading: boolean;
  onUpload: (file: File | undefined) => void;
}

export function ProfileHeaderSummary({
  avatarUrl,
  fullName,
  role,
  isUploading,
  onUpload,
}: ProfileHeaderSummaryProps) {
  const [imgError, setImgError] = useState(false);

  const isSiswa = role === "siswa";
  const displayRole = isSiswa
    ? "Siswa SMB"
    : role === "admin"
      ? "Admin"
      : "Pembina";
  const accessLevel = isSiswa ? "Akses Pelajar" : "Level Akses Penuh (Root)";
  const subTitle = isSiswa
    ? "Kelola identitas personal dan akses portal siswa Anda"
    : "Kontrol akses dan identitas personal sistem";

  return (
    <div className="space-y-6">
      <PageHeader
        title="PENGATURAN"
        highlightText="AKUN"
        icon={<UserCog size={24} />}
        subtitle={subTitle}
        themeColor="orange"
        rightContent={
          <div className="hidden md:block">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200">
              Sesi Aktif:{" "}
              {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        }
      />

      <AppCard className="flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden group p-6 md:p-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 group-hover:bg-orange-100 transition-colors" />

        <div className="relative shrink-0">
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-100 relative flex items-center justify-center">
            {avatarUrl && !imgError ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                fill
                className="object-cover"
                unoptimized
                onError={() => setImgError(true)}
              />
            ) : (
              <User size={48} className="text-slate-300" strokeWidth={1.5} />
            )}

            <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-all duration-300 backdrop-blur-sm">
              {isUploading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  <Camera size={24} className="mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Update Foto
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setImgError(false);
                  onUpload(e.target.files?.[0]);
                }}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        <div className="flex-1 space-y-3 text-center md:text-left relative z-10 pt-2">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider flex items-center justify-center md:justify-start gap-1.5">
              <UserCheck size={14} /> PROFIL TERVERIFIKASI
            </p>
            <h2 className="text-2xl font-bold text-slate-800 leading-tight">
              {fullName || "User SMB"}
            </h2>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="px-3 py-1 bg-slate-900 text-white rounded-md font-bold text-[10px] uppercase tracking-wider shadow-sm">
              {displayRole}
            </div>
            <div className="h-1.5 w-1.5 bg-slate-300 rounded-full" />
            <p className="text-xs font-semibold text-slate-500">
              {accessLevel}
            </p>
          </div>
        </div>
      </AppCard>
    </div>
  );
}
