/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { AppCard } from "../../shared/AppCard";
import { updateOwnProfile, uploadAvatar } from "@/actions/shared/profile";
import { ProfileHeaderSummary } from "../../shared/profile/ProfileHeaderSummary";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { EmailForm } from "../../shared/profile/EmailForm";
import { PasswordForm } from "../../shared/profile/PasswordForm";
import toast from "react-hot-toast";

import type { OwnProfileData } from "@/actions/shared/profile";

interface ProfileManagementUIProps {
  initialProfile: OwnProfileData;
}

export function ProfileManagementUI({
  initialProfile,
}: ProfileManagementUIProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<OwnProfileData>({
    ...initialProfile,
  });

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setIsUploading(true);
    const toastId = toast.loading("Mengunggah foto...");
    try {
      const formDataPayload = new FormData();
      formDataPayload.append("avatar", file);
      const url = await uploadAvatar(
        formDataPayload,
        "admin",
        formData.avatar_url || undefined,
      );
      setFormData((previousState) => ({
        ...previousState,
        avatar_url: url,
      }));
      toast.success("Foto diperbarui!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveInfo = () => {
    startTransition(async () => {
      const toastId = toast.loading("Menyimpan identitas...");
      try {
        await updateOwnProfile({
          full_name: formData.full_name || "",
          phone_number: formData.phone_number || "",
        }, "admin");
        toast.success("Data berhasil disimpan!", { id: toastId });
      } catch (error: any) {
        toast.error(error.message, { id: toastId });
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <ProfileHeaderSummary
        avatarUrl={formData.avatar_url}
        fullName={formData.full_name}
        role={formData.role}
        isUploading={isUploading}
        onUpload={handleUpload}
      />

      <AppCard className="p-0 border-none bg-transparent shadow-none">
        <PersonalInfoForm
          data={formData}
          onChange={(key: keyof OwnProfileData, value: string) =>
            setFormData((previousState) => ({ ...previousState, [key]: value }))
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
