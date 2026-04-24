/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { AppCard } from "@/components/shared/AppCard";
import {
  updateOwnProfile,
  uploadAvatar,
  type OwnProfileData,
} from "@/actions/shared/profile";
import { ProfileHeaderSummary } from "@/components/shared/profile/ProfileHeaderSummary";
import { PembinaPersonalInfoForm } from "./PembinaPersonalInfoForm";
import { EmailForm } from "@/components/shared/profile/EmailForm";
import { PasswordForm } from "@/components/shared/profile/PasswordForm";

interface PembinaProfileManagementUIProps {
  initialProfile: OwnProfileData;
}

export function PembinaProfileManagementUI({
  initialProfile,
}: PembinaProfileManagementUIProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<OwnProfileData>({
    ...initialProfile,
  });

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setIsUploading(true);
    const toastId = toast.loading("Mengunggah foto profil...");
    try {
      const formDataPayload = new FormData();
      formDataPayload.append("avatar", file);

      const url = await uploadAvatar(
        formDataPayload,
        "pembina",
        formData.avatar_url || undefined,
      );

      setFormData((prev) => ({ ...prev, avatar_url: url }));
      toast.success("Foto diperbarui!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveInfo = () => {
    startTransition(async () => {
      const toastId = toast.loading("Menyimpan perubahan data...");
      try {
        await updateOwnProfile(
          {
            full_name: formData.full_name || "",
            buddhist_name: formData.buddhist_name || null,
            phone_number: formData.phone_number || null,
            birth_place: formData.birth_place || null,
            birth_date: formData.birth_date || null,
            address: formData.address || null,
            parent_name: formData.parent_name || null,
            parent_phone_number: formData.parent_phone_number || null,
            school_name: formData.school_name || null,
            hobby: formData.hobby || null,
            gender: formData.gender as any,
          },
          "pembina",
        );

        toast.success("Biodata Pembina berhasil disimpan!", { id: toastId });
      } catch (error: any) {
        toast.error(error.message, { id: toastId });
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <ProfileHeaderSummary
        avatarUrl={formData.avatar_url}
        fullName={formData.full_name}
        role={formData.role || "pembina"}
        isUploading={isUploading}
        onUpload={handleUpload}
      />

      <AppCard className="p-0 border-none bg-transparent shadow-none">
        <PembinaPersonalInfoForm
          data={formData}
          onChange={(key: keyof OwnProfileData, value: string) =>
            setFormData((prev) => ({ ...prev, [key]: value }))
          }
          onSave={handleSaveInfo}
          isPending={isPending}
        />
      </AppCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmailForm initialEmail={initialProfile.email} />
        <PasswordForm />
      </div>
    </div>
  );
}
