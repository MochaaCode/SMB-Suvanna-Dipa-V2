/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPembinaClasses() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user)
    throw new Error("Sesi tidak valid atau telah berakhir.");

  try {
    // 1. Tarik semua kelas yang aktif
    const { data: classesData, error: classErr } = await supabase
      .from("classes")
      .select("id, name, teacher_id, assistant_ids")
      .eq("is_deleted", false)
      .order("name", { ascending: true });

    if (classErr) throw new Error(classErr.message);

    // 2. Tarik data profil untuk menghitung jumlah siswa per kelas
    const { data: profilesData, error: profErr } = await supabase
      .from("profiles")
      .select("class_id")
      .eq("role", "siswa")
      .eq("is_deleted", false);

    if (profErr) throw new Error(profErr.message);

    const userId = user.id;

    // 3. Mapping data dengan logika Otoritas dan Slug
    const formattedData = classesData.map((cls) => {
      const studentCount = profilesData.filter(
        (p) => p.class_id === cls.id,
      ).length;

      // Tentukan apakah user adalah Guru Utama atau Asisten di kelas ini
      const isTeacher = cls.teacher_id === userId;
      const isAssistant = cls.assistant_ids?.includes(userId) || false;
      const isAuthorized = isTeacher || isAssistant;

      let roleInClass = null;
      if (isTeacher) roleInClass = "Guru Utama";
      else if (isAssistant) roleInClass = "Asisten (GL)";

      // Generate slug dari nama kelas (misal: "Kelas Anicca" -> "kelas-anicca")
      const slug = cls.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      return {
        id: cls.id,
        name: cls.name,
        slug: slug,
        studentCount: studentCount,
        isAuthorized: isAuthorized,
        roleInClass: roleInClass,
      };
    });

    return formattedData;
  } catch (error: any) {
    throw new Error("Gagal memuat daftar kelas: " + error.message);
  }
}
