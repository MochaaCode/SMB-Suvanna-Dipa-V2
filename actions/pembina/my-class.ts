"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Profile } from "@/types";

export async function getMyClassData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sesi berakhir.");

  const { data: myClass, error: classErr } = await supabase
    .from("classes")
    .select("id, name, teacher_id, assistant_ids")
    .or(`teacher_id.eq.${user.id},assistant_ids.cs.{${user.id}}`)
    .eq("is_deleted", false)
    .maybeSingle();

  if (classErr) throw new Error(classErr.message);
  if (!myClass) return null;

  const { data: students, error: studentErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("class_id", myClass.id)
    .eq("role", "siswa")
    .eq("is_deleted", false)
    .order("full_name", { ascending: true });

  if (studentErr) throw new Error(studentErr.message);

  const stats = {
    total: students.length,
    laki: students.filter((s) => s.gender === "Laki-Laki").length,
    perempuan: students.filter((s) => s.gender === "Perempuan").length,
    avgPoints:
      students.length > 0
        ? Math.round(
            students.reduce((acc, s) => acc + (s.points || 0), 0) /
              students.length,
          )
        : 0,
  };

  const roleInClass =
    myClass.teacher_id === user.id ? "Guru Utama" : "Asisten (GL)";

  return {
    classInfo: { ...myClass, roleInClass },
    students: students as Profile[],
    stats,
  };
}

export async function bulkGivePointsAction(
  studentIds: string[],
  amount: number,
  reason: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sesi berakhir.");

  const supabaseAdmin = createAdminClient();

  const historyData = studentIds.map((id) => ({
    user_id: id,
    amount: amount,
    type: "earning",
    description: reason || "Reward dari Pembina",
    given_by: user.id,
  }));

  const { error: histErr } = await supabaseAdmin
    .from("point_history")
    .insert(historyData);

  if (histErr)
    throw new Error("Gagal mencatat riwayat poin: " + histErr.message);

  for (const id of studentIds) {
    const { data: current, error: readErr } = await supabaseAdmin
      .from("profiles")
      .select("points")
      .eq("id", id)
      .single();

    if (readErr)
      throw new Error("Gagal membaca poin siswa: " + readErr.message);

    const newTotal = (current?.points || 0) + amount;

    const { error: updateErr } = await supabaseAdmin
      .from("profiles")
      .update({ points: newTotal, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (updateErr)
      throw new Error("Gagal memperbarui poin siswa: " + updateErr.message);
  }

  revalidatePath("/pembina/my-class");
  return { success: true };
}
