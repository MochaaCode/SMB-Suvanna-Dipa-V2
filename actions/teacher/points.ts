/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  givePointsSchema,
  type GivePointsInput,
} from "@/lib/validations/points";
import { revalidatePath } from "next/cache";

/**
 * FUNGSI BARU: MEMBERIKAN POIN KE BANYAK SISWA SEKALIGUS
 */
export async function bulkGivePointsAction(
  studentIds: string[],
  amount: number,
  description: string,
) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sesi habis." };

  try {
    const historyData = studentIds.map((id) => ({
      user_id: id,
      amount: amount,
      description: `[Bulk] ${description}`,
      type: "earning",
      given_by: user.id,
    }));

    const { error: histErr } = await supabaseAdmin
      .from("point_history")
      .insert(historyData);
    if (histErr) throw histErr;

    for (const id of studentIds) {
      const { data: current } = await supabaseAdmin
        .from("profiles")
        .select("points")
        .eq("id", id)
        .single();
      const newTotal = (current?.points || 0) + amount;

      await supabaseAdmin
        .from("profiles")
        .update({ points: newTotal })
        .eq("id", id);
    }

    revalidatePath("/pembina/classes", "layout");
    return {
      success: true,
      message: `Berhasil membagikan ${amount} poin ke ${studentIds.length} siswa!`,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function givePointsAction(data: GivePointsInput) {
  const validated = givePointsSchema.safeParse(data);
  if (!validated.success)
    return { success: false, error: validated.error.flatten().fieldErrors };

  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Sesi habis." };

  const role = user.app_metadata?.role;
  if (role !== "admin" && role !== "pembina")
    return { success: false, error: "Akses ditolak." };

  const { data: targetProfile, error: targetErr } = await supabaseAdmin
    .from("profiles")
    .select("points")
    .eq("id", validated.data.user_id)
    .single();
  if (targetErr) return { success: false, error: "Siswa tidak ditemukan." };

  const newTotal = (targetProfile?.points || 0) + validated.data.amount;
  const { error: updateErr } = await supabaseAdmin
    .from("profiles")
    .update({ points: newTotal })
    .eq("id", validated.data.user_id);
  if (updateErr) return { success: false, error: "Gagal memperbarui poin." };

  await supabaseAdmin.from("point_history").insert({
    user_id: validated.data.user_id,
    amount: validated.data.amount,
    description: validated.data.reason,
    type: "earning",
    given_by: user.id,
  });

  revalidatePath("/", "layout");
  return { success: true, message: "Poin berhasil ditambahkan!" };
}
