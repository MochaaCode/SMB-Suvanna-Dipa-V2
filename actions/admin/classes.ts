"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import type { Profile, Class, UserRole } from "@/types";

export interface ClassWithDetails extends Class {
  teacher: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  students: {
    id: string;
    full_name: string | null;
    points: number;
    birth_date: string | null;
    role: UserRole;
  }[];
}

export interface PromotionSuggestion {
  studentId: string;
  name: string | null;
  currentClassId: number | null;
  targetClassId: number | null;
  targetClassName: string;
  age: number;
}

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

  if (profile?.role !== "admin")
    throw new Error("Terlarang! Akses khusus Admin.");

  return supabase;
}

export async function getClassesWithDetails(): Promise<ClassWithDetails[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("classes")
    .select(
      `
      *,
      teacher:teacher_id ( id, full_name, avatar_url ),
      students:profiles!class_id ( id, full_name, points, birth_date, role )
    `,
    )
    .eq("is_deleted", false)
    .order("min_age", { ascending: true });

  if (error) throw new Error(error.message);

  const rawClasses = data as unknown as ClassWithDetails[];

  return rawClasses.map((cls) => ({
    ...cls,
    students: cls.students?.filter((s) => s.role === "siswa") || [],
  }));
}

export async function getPromotionSuggestions(): Promise<
  PromotionSuggestion[]
> {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name, birth_date, class_id, role")
    .eq("role", "siswa")
    .eq("is_deleted", false);

  const { data: classes } = await supabase
    .from("classes")
    .select("*")
    .eq("is_deleted", false);

  if (!students || !classes) return [];

  const typedClasses = classes as unknown as Class[];
  const currentYear = new Date().getFullYear();
  const cutoffDate = new Date(currentYear, 6, 1); // 1 Juli
  const maxSystemAge = Math.max(...typedClasses.map((c) => c.max_age ?? 0));

  const suggestions: PromotionSuggestion[] = [];

  for (const student of students) {
    if (!student.birth_date) continue;

    const birth = new Date(student.birth_date);
    let ageAtCutoff = currentYear - birth.getFullYear();
    const birthdayThisYear = new Date(
      currentYear,
      birth.getMonth(),
      birth.getDate(),
    );

    if (birthdayThisYear > cutoffDate) ageAtCutoff--;

    if (ageAtCutoff > maxSystemAge) {
      if (student.class_id !== null) {
        suggestions.push({
          studentId: student.id,
          name: student.full_name,
          currentClassId: student.class_id,
          targetClassId: null,
          targetClassName: "Alumni",
          age: ageAtCutoff,
        });
      }
      continue;
    }

    const targetClass = typedClasses.find(
      (c) =>
        ageAtCutoff >= (c.min_age ?? 0) && ageAtCutoff <= (c.max_age ?? 99),
    );

    if (targetClass && student.class_id !== targetClass.id) {
      suggestions.push({
        studentId: student.id,
        name: student.full_name,
        currentClassId: student.class_id,
        targetClassId: targetClass.id,
        targetClassName: targetClass.name,
        age: ageAtCutoff,
      });
    }
  }

  return suggestions;
}

export async function promoteStudentsBulk(promotions: PromotionSuggestion[]) {
  const supabase = await ensureAdmin();
  const errors: string[] = [];
  let successCount = 0;

  for (const promo of promotions) {
    const { error } = await supabase
      .from("profiles")
      .update({
        class_id: promo.targetClassId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", promo.studentId);

    if (error) {
      errors.push(`Gagal: ${promo.name} (${error.message})`);
    } else {
      successCount++;
    }
  }

  revalidatePath("/admin/classes");
  revalidatePath("/admin/users");
  return { success: successCount, failed: errors.length, errors };
}

export async function getAvailablePembina() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("role", "pembina")
    .eq("is_deleted", false)
    .order("full_name", { ascending: true });

  if (error) throw new Error(error.message);

  return data as unknown as Pick<Profile, "id" | "full_name" | "avatar_url">[];
}

export async function getAvailableGL(): Promise<
  Pick<Profile, "id" | "full_name" | "avatar_url">[]
> {
  const supabase = await createClient();

  const { data: classData } = await supabase
    .from("classes")
    .select("id")
    .ilike("name", "Lulus")
    .single();

  if (!classData) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("role", "siswa")
    .eq("class_id", classData.id)
    .eq("is_deleted", false)
    .order("full_name", { ascending: true });

  if (error) throw new Error(error.message);

  return data as unknown as Pick<Profile, "id" | "full_name" | "avatar_url">[];
}

export async function updateClassStaff(
  classId: number,
  teacherId: string | null,
  assistantIds: string[],
) {
  const supabase = await ensureAdmin();

  if (teacherId) {
    const { data: existingTeacherClass } = await supabase
      .from("classes")
      .select("id, name")
      .eq("teacher_id", teacherId)
      .neq("id", classId)
      .eq("is_deleted", false)
      .maybeSingle();

    if (existingTeacherClass) {
      throw new Error(
        `Pembina ini sudah menjadi Pengajar Utama di Kelas ${(existingTeacherClass as { id: number; name: string }).name}. Satu pembina hanya bisa mengajar di satu kelas.`,
      );
    }
  }

  if (assistantIds.length > 0) {
    const { data: allOtherClasses } = await supabase
      .from("classes")
      .select("id, name, assistant_ids")
      .neq("id", classId)
      .eq("is_deleted", false);

    for (const aId of assistantIds) {
      const conflictClass = (
        allOtherClasses as
          | { id: number; name: string; assistant_ids: string[] | null }[]
          | null
      )?.find((c) => c.assistant_ids?.includes(aId));

      if (conflictClass) {
        const { data: glProfile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", aId)
          .single();

        const glName =
          (glProfile as { full_name: string | null } | null)?.full_name ||
          "Kakak GL ini";

        throw new Error(
          `${glName} sudah menjadi Kakak GL di Kelas ${conflictClass.name}. Satu Kakak GL hanya bisa mengisi satu kelas.`,
        );
      }
    }
  }

  const { error } = await supabase
    .from("classes")
    .update({
      teacher_id: teacherId || null,
      assistant_ids: assistantIds,
      updated_at: new Date().toISOString(),
    })
    .eq("id", classId);

  if (error) throw new Error("Gagal update staff: " + error.message);

  revalidatePath("/admin/classes");
  return { success: true };
}
