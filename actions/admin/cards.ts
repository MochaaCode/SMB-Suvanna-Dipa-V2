"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// IMPORT TIPE KETAT
import type { Profile, CardStatus } from "@/types";

export interface CardWithProfile {
  uid: string;
  status: CardStatus;
  created_at: string;
  profile: {
    id: string;
    full_name: string | null;
    role: string;
  } | null;
}

// HELPER: Proteksi Admin
async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi berakhir, silakan login kembali.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin")
    throw new Error("Akses ditolak: Anda bukan admin.");

  return supabase;
}

/**
 * 1. AMBIL SEMUA KARTU BESERTA PEMILIKNYA
 */
export async function getCardsWithProfiles(): Promise<CardWithProfile[]> {
  const supabase = await ensureAdmin();
  const { data, error } = await supabase
    .from("rfid_tags")
    .select(
      `
      uid,
      status,
      created_at,
      profile:profiles ( id, full_name, role )
    `,
    )
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  // Type casting hasil join
  return data as unknown as CardWithProfile[];
}

/**
 * 2. REGISTRASI KARTU BARU (DENGAN LOGIKA RESTORE)
 */
export async function registerNewCard(uid: string) {
  const supabase = await ensureAdmin();

  const { data: existingCard } = await supabase
    .from("rfid_tags")
    .select("uid, is_deleted")
    .eq("uid", uid)
    .single();

  if (existingCard) {
    if (existingCard.is_deleted) {
      const { error: restoreError } = await supabase
        .from("rfid_tags")
        .update({
          is_deleted: false,
          status: "tersedia" as CardStatus,
          profile_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("uid", uid);

      if (restoreError) throw new Error(restoreError.message);
    } else {
      throw new Error("UID ini sudah terdaftar dan masih aktif!");
    }
  } else {
    const { error: insertError } = await supabase.from("rfid_tags").insert({
      uid: uid,
      status: "tersedia" as CardStatus,
      is_deleted: false,
      updated_at: new Date().toISOString(),
    });
    if (insertError) throw new Error(insertError.message);
  }

  revalidatePath("/admin/cards");
  return { success: true };
}

/**
 * 3. PASANGKAN KARTU KE USER (PAIRING)
 */
export async function pairCard(rfidUid: string, profileId: string) {
  const supabase = await ensureAdmin();
  const { error } = await supabase
    .from("rfid_tags")
    .update({
      profile_id: profileId,
      status: "terpakai" as CardStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("uid", rfidUid);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/cards");
  return { success: true };
}

/**
 * 4. LEPAS KARTU DARI USER (UNPAIR)
 */
export async function unpairCard(rfidUid: string) {
  const supabase = await ensureAdmin();
  const { error } = await supabase
    .from("rfid_tags")
    .update({
      profile_id: null,
      status: "tersedia" as CardStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("uid", rfidUid);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/cards");
  return { success: true };
}

/**
 * 5. TANDAI KARTU SEBAGAI HILANG
 */
export async function markCardAsLost(rfidUid: string) {
  const supabase = await ensureAdmin();
  const { error } = await supabase
    .from("rfid_tags")
    .update({
      profile_id: null,
      status: "hilang" as CardStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("uid", rfidUid);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/cards");
  return { success: true };
}

/**
 * 6. SOFT DELETE KARTU
 */
export async function deleteCard(rfidUid: string) {
  const supabase = await ensureAdmin();
  const { error } = await supabase
    .from("rfid_tags")
    .update({
      is_deleted: true,
      updated_at: new Date().toISOString(),
    })
    .eq("uid", rfidUid);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/cards");
  return { success: true };
}

/**
 * 7. AMBIL LIST USER UNTUK PAIRING
 */
export async function getUsersForCards(): Promise<
  Pick<Profile, "id" | "full_name" | "role">[]
> {
  const supabase = await ensureAdmin();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("is_deleted", false)
    .order("full_name", { ascending: true });

  if (error) throw new Error(error.message);
  return data as unknown as Pick<Profile, "id" | "full_name" | "role">[];
}
