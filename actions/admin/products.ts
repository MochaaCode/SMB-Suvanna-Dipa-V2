"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Product } from "@/types";

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

  if (profile?.role !== "admin") throw new Error("Akses ditolak!");
  return createAdminClient();
}

async function deleteProductImage(imageUrl: string) {
  const supabaseAdmin = createAdminClient();
  try {
    const fileName = imageUrl.split("/").pop();
    if (fileName) {
      await supabaseAdmin.storage.from("products").remove([fileName]);
    }
  } catch (err) {
    console.error("⚠️ [Error Hapus Storage]:", err);
  }
}

async function uploadProductImage(file: File) {
  const supabaseAdmin = createAdminClient();
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const fileBuffer = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from("products")
    .upload(fileName, fileBuffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw new Error("Gagal mengunggah gambar: " + error.message);

  const { data } = supabaseAdmin.storage
    .from("products")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Product[];
}

export async function getArchivedProducts(): Promise<Product[]> {
  const supabaseAdmin = await ensureAdmin();
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("is_deleted", true)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Product[];
}

export async function upsertProduct(formData: FormData, productId?: number) {
  const supabaseAdmin = await ensureAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseInt(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const imageFile = formData.get("image") as File | null;

  let imageUrl = null;

  if (productId) {
    const { data: existing } = await supabaseAdmin
      .from("products")
      .select("image_url")
      .eq("id", productId)
      .single();
    imageUrl = existing?.image_url;
  }

  if (imageFile && imageFile.size > 0) {
    if (imageUrl) {
      await deleteProductImage(imageUrl);
    }
    imageUrl = await uploadProductImage(imageFile);
  }

  const payload = {
    name,
    description,
    price,
    stock,
    image_url: imageUrl,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (productId) {
    const { error: updateErr } = await supabaseAdmin
      .from("products")
      .update(payload)
      .eq("id", productId);
    error = updateErr;
  } else {
    const { error: insertErr } = await supabaseAdmin
      .from("products")
      .insert(payload);
    error = insertErr;
  }

  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  return { success: true };
}

export async function setProductDeletedStatus(id: number, status: boolean) {
  const supabaseAdmin = await ensureAdmin();
  const { error } = await supabaseAdmin
    .from("products")
    .update({ is_deleted: status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProductPermanent(
  id: number,
  imageUrl: string | null,
) {
  const supabaseAdmin = await ensureAdmin();

  if (imageUrl) {
    await deleteProductImage(imageUrl);
  }

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  return { success: true };
}
