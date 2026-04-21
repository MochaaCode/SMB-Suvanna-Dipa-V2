/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { PublicContent } from "@/types";

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sesi berakhir.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Terlarang!");
  return createAdminClient();
}

export async function getPublicContent(): Promise<PublicContent[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("public_content")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data as PublicContent[];
}

export async function updateContentStatus(id: number, status: boolean) {
  const supabaseAdmin = await ensureAdmin();
  const { error } = await supabaseAdmin
    .from("public_content")
    .update({ is_published: status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/public-content");
  revalidatePath("/");
  return { success: true };
}

export async function updatePublicContent(
  section: string,
  contentPayload: Record<string, unknown>,
) {
  const supabaseAdmin = await ensureAdmin();
  const { error } = await supabaseAdmin
    .from("public_content")
    .update({ content: contentPayload, updated_at: new Date().toISOString() })
    .eq("section", section);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/public-content");
  revalidatePath("/");
  return { success: true };
}

export async function uploadContentImage(formData: FormData) {
  const supabaseAdmin = await ensureAdmin();
  const file = formData.get("image") as File;

  if (!file) throw new Error("File tidak ditemukan");

  const fileExt = file.name.split(".").pop();
  const fileName = `content-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("contents")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) throw new Error("Gagal upload: " + uploadError.message);

  const { data } = supabaseAdmin.storage
    .from("contents")
    .getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteContentImage(imageUrl: string) {
  if (!imageUrl) return { success: false };
  const supabaseAdmin = await ensureAdmin();

  try {
    const fileName = imageUrl.split("/").pop();
    if (fileName) {
      const { error } = await supabaseAdmin.storage
        .from("contents")
        .remove([fileName]);
      if (error) throw new Error(error.message);
    }
    return { success: true };
  } catch (error: any) {
    throw new Error("Gagal menghapus file fisik storage.");
  }
}
