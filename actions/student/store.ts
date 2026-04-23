"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  redeemRewardSchema,
  type RedeemRewardInput,
} from "@/lib/validations/points";
import { revalidatePath } from "next/cache";
import type { Product } from "@/types";

export async function getAvailableProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_deleted", false)
    .gt("stock", 0)
    .order("price", { ascending: true });

  if (error) throw new Error("Gagal mengambil katalog: " + error.message);
  return (data || []) as Product[];
}

export async function redeemRewardAction(data: RedeemRewardInput) {
  console.log("--- START TRACKING REDEEM ---");
  console.log("Input Payload:", data);

  const validated = redeemRewardSchema.safeParse(data);
  if (!validated.success) {
    console.error("Zod Validation Error:", validated.error.format());
    return { success: false, error: "ID Produk tidak valid." };
  }

  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("Auth Error: No Session Found");
    return { success: false, error: "Silakan login kembali." };
  }

  console.log("Target User ID:", user.id);

  // Ambil data secara paralel
  const [productRes, profileRes] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("id", validated.data.product_id)
      .single(),
    supabase.from("profiles").select("points").eq("id", user.id).single(),
  ]);

  const product = productRes.data as Product | null;
  const profile = profileRes.data;

  console.log(
    "Product Data fetched:",
    product
      ? { name: product.name, price: product.price, stock: product.stock }
      : "NULL",
  );
  console.log("User Points fetched:", profile?.points ?? "NULL");

  if (!product || product.is_deleted)
    return { success: false, error: "Barang tidak tersedia." };
  if (product.stock < 1) return { success: false, error: "Stok habis." };

  // Logic 0 poin: 3 - 0 = 3 tetap sukses
  if ((profile?.points || 0) < product.price) {
    console.warn("Logic Failed: Poin user tidak cukup");
    return { success: false, error: "Poin kurang." };
  }

  console.log("Logic Check PASSED. Attempting Database INSERT...");

  // INSERT KE DATABASE
  const { error: orderError } = await supabaseAdmin
    .from("product_orders")
    .insert({
      user_id: user.id,
      product_id: product.id,
      total_points: product.price,
      status: "pending",
    });

  if (orderError) {
    console.error("--- DATABASE REJECTED INSERT ---");
    console.error("Error Code:", orderError.code);
    console.error("Error Message:", orderError.message);
    console.error("Detail Error:", orderError.details);

    // Mapping error trigger database ke pesan yang ramah
    if (orderError.message.includes("stok produk ini sudah habis"))
      return { success: false, error: "Stok produk baru saja habis!" };
    if (orderError.message.includes("Poin tidak cukup"))
      return {
        success: false,
        error: "Gagal: Database mendeteksi saldo poin tidak cukup.",
      };

    return { success: false, error: `Sistem Error: ${orderError.message}` };
  }

  console.log("--- REDEEM SUCCESSFUL ---");
  revalidatePath("/", "layout");
  return { success: true, message: "Hadiah berhasil diklaim!" };
}
