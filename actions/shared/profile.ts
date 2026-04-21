"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  profileUpdateSchema,
  type ProfileUpdateInput,
} from "@/lib/validations/profile";
import type { Profile } from "@/types";

export type OwnProfileData = Profile & { email: string | undefined };

export async function getOwnProfile(): Promise<OwnProfileData> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) throw new Error("Sesi berakhir.");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw new Error(error.message);
  return { ...(data as Profile), email: user.email };
}

// PERBAIKAN UTAMA: Tambahkan parameter rolePath agar revalidatePath dinamis
export async function updateOwnProfile(
  payload: ProfileUpdateInput & { parent_phone_number?: string | null },
  rolePath: "admin" | "siswa" | "pembina",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi tidak valid");

  const validated = profileUpdateSchema.safeParse(payload);
  if (!validated.success) {
    const errorMessage =
      validated.error.issues?.[0]?.message || "Format input tidak sesuai.";
    throw new Error("Data tidak valid: " + errorMessage);
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: validated.data.full_name,
      buddhist_name: validated.data.buddhist_name,
      gender: validated.data.gender,
      birth_place: validated.data.birth_place,
      birth_date: validated.data.birth_date,
      address: validated.data.address,
      phone_number: validated.data.phone_number,
      parent_name: validated.data.parent_name,
      parent_phone_number: payload.parent_phone_number,
      school_name: validated.data.school_name,
      hobby: validated.data.hobby,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  await supabase.auth.updateUser({
    data: { full_name: validated.data.full_name },
  });

  // REVALIDATE DINAMIS SESUAI ROLE
  revalidatePath(`/${rolePath}/profile`);
  revalidatePath(`/${rolePath}/dashboard`);
  return { success: true };
}

export async function updateOwnEmail(newEmail: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) throw new Error(error.message);
  return {
    success: true,
    message: "Cek inbox email baru Anda untuk konfirmasi perubahan.",
  };
}

export async function updateOwnPassword(newPassword: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
  return { success: true };
}

// PERBAIKAN UTAMA: Tambahkan parameter rolePath untuk revalidasi
export async function uploadAvatar(
  formData: FormData,
  rolePath: "admin" | "siswa" | "pembina",
  oldAvatarUrl?: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Akses ditolak.");

  const file = formData.get("avatar") as File;
  if (!file) throw new Error("File nihil.");

  if (oldAvatarUrl && oldAvatarUrl.includes("/avatars/")) {
    const fileName = oldAvatarUrl.split("/").pop();
    if (fileName) {
      await supabase.storage.from("avatars").remove([`${user.id}/${fileName}`]);
    }
  }

  const fileExt = file.name.split(".").pop();
  const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) throw new Error("Storage error: " + uploadError.message);

  const { data: urlRes } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  await supabase
    .from("profiles")
    .update({ avatar_url: urlRes.publicUrl })
    .eq("id", user.id);
  await supabase.auth.updateUser({ data: { avatar_url: urlRes.publicUrl } });

  // REVALIDATE DINAMIS SESUAI ROLE
  revalidatePath(`/${rolePath}/profile`);
  revalidatePath(`/${rolePath}/dashboard`);
  return urlRes.publicUrl;
}
