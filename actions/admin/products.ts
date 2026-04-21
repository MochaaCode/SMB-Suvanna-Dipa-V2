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

  const { error: uploadError } = await supabaseAdmin.storage
    .from("products")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError)
    throw new Error("Gagal upload gambar: " + uploadError.message);

  const { data } = supabaseAdmin.storage
    .from("products")
    .getPublicUrl(fileName);
  return data.publicUrl;
}

export async function upsertProduct(formData: FormData) {
  const supabaseAdmin = await ensureAdmin();

  const id = formData.get("id") ? Number(formData.get("id")) : undefined;
  const name = formData.get("name") as string;
  const imageFile = formData.get("image") as File | null;
  const oldImageUrl = formData.get("image_url") as string | null;
  let imageUrl = oldImageUrl;

  if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
    imageUrl = await uploadProductImage(imageFile);
    if (id && oldImageUrl) await deleteProductImage(oldImageUrl);
  }

  const productData: Partial<Product> = {
    name,
    description: formData.get("description") as string,
    price: parseInt(formData.get("price") as string),
    stock: parseInt(formData.get("stock") as string),
    image_url: imageUrl,
    updated_at: new Date().toISOString(),
  };

  const { error } = id
    ? await supabaseAdmin.from("products").update(productData).eq("id", id)
    : await supabaseAdmin.from("products").insert([productData]);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/products");
  return { success: true };
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
  if (imageUrl) await deleteProductImage(imageUrl);

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) throw new Error("Gagal hapus permanen.");

  revalidatePath("/admin/products");
  return { success: true };
}
