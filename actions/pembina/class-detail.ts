/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getClassDetailBySlug(slug: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user)
    throw new Error("Sesi tidak valid atau telah berakhir.");

  try {
    // 1. Tarik semua kelas untuk dicocokkan dengan slug
    const { data: classesData, error: classErr } = await supabase
      .from("classes")
      .select("id, name, teacher_id, assistant_ids")
      .eq("is_deleted", false);

    if (classErr) throw new Error(classErr.message);

    // 2. Cari kelas yang slug-nya cocok dengan parameter URL
    const targetClass = classesData.find((cls) => {
      const generatedSlug = cls.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      return generatedSlug === slug;
    });

    if (!targetClass) throw new Error("Kelas tidak ditemukan.");

    // 3. Validasi Otoritas Pembina (Hanya Guru Utama atau GL yang boleh akses)
    const isTeacher = targetClass.teacher_id === user.id;
    const isAssistant = targetClass.assistant_ids?.includes(user.id) || false;

    if (!isTeacher && !isAssistant) {
      throw new Error("Akses Ditolak: Anda tidak ditugaskan di kelas ini.");
    }

    // 4. Tarik data siswa yang terdaftar di kelas ini
    const { data: studentsData, error: studentErr } = await supabase
      .from("profiles")
      .select("id, full_name, buddhist_name, points, gender, avatar_url")
      .eq("class_id", targetClass.id)
      .eq("role", "siswa")
      .eq("is_deleted", false)
      .order("full_name", { ascending: true });

    if (studentErr) throw new Error(studentErr.message);

    return {
      classInfo: {
        id: targetClass.id,
        name: targetClass.name,
        roleInClass: isTeacher ? "Guru Utama" : "Asisten (GL)",
      },
      students: studentsData || [],
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
