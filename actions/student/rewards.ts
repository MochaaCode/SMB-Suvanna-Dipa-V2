"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  redeemRewardSchema,
  type RedeemRewardInput,
} from "@/lib/validations/points";
import { revalidatePath } from "next/cache";
import { Product } from "@/types";

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
  const validated = redeemRewardSchema.safeParse(data);
  if (!validated.success)
    return { success: false, error: "ID Produk tidak valid." };

  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Silakan login kembali." };

  const [productRes, profileRes] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("id", validated.data.product_id)
      .single(),
    supabase.from("profiles").select("points").eq("id", user.id).single(),
  ]);

  const product = productRes.data;
  const profile = profileRes.data;

  if (!product || product.is_deleted)
    return { success: false, error: "Barang tidak tersedia." };
  if (product.stock < 1) return { success: false, error: "Stok habis." };
  if ((profile?.points || 0) < product.price)
    return { success: false, error: "Poin kurang." };

  const { error: orderError } = await supabaseAdmin
    .from("product_orders")
    .insert({
      user_id: user.id,
      product_id: product.id,
      total_points: product.price,
      status: "pending",
    });

  if (orderError) {
    if (orderError.message.includes("Poin tidak cukup"))
      return { success: false, error: "Transaksi ditolak: Poin tidak cukup." };
    if (orderError.message.includes("stok produk ini sudah habis"))
      return { success: false, error: "Transaksi ditolak: Stok habis." };
    return { success: false, error: "Gagal memproses penukaran." };
  }

  revalidatePath("/", "layout");
  return { success: true, message: "Hadiah berhasil diklaim!" };
}
