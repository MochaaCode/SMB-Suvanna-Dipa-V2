"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { AttendanceStatus } from "@/types";

export type YearlyRecapData = {
  "Nama Lengkap": string;
  Kelas: string;
  "Total Poin": number;
  "Total Hadir": number;
  "Total Terlambat": number;
  "Total Izin/Sakit": number;
  "Total Alpa": number;
  "Status Keaktifan": string;
};

type RawProfileQuery = {
  full_name: string | null;
  points: number;
  classes: { name: string } | { name: string }[] | null;
  attendance_logs: { status: AttendanceStatus }[] | null;
};

export async function getYearlyRecapData(): Promise<YearlyRecapData[]> {
  const supabaseAdmin = createAdminClient();

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select(
      `
      full_name,
      points,
      classes!profiles_class_id_fkey(name),
      attendance_logs!attendance_logs_profile_id_fkey(status)
    `,
    )
    .eq("role", "siswa");

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error("Gagal mengambil data: " + error.message);
  }

  const rawData = (data || []) as RawProfileQuery[];

  return rawData
    .map((s) => {
      const logs = s.attendance_logs || [];

      let hadir = 0;
      let terlambat = 0;
      let izinSakit = 0;
      let alpa = 0;

      for (const l of logs) {
        switch (l.status) {
          case "hadir":
            hadir++;
            break;
          case "terlambat":
            terlambat++;
            break;
          case "izin":
            izinSakit++;
            break;
          case "alpa":
            alpa++;
            break;
        }
      }

      const cls = Array.isArray(s.classes) ? s.classes[0] : s.classes;

      const totalKehadiran = hadir + terlambat;

      return {
        "Nama Lengkap": s.full_name ?? "Tanpa Nama",
        Kelas: cls?.name ?? "Belum Masuk Kelas",
        "Total Poin": s.points ?? 0,
        "Total Hadir": hadir,
        "Total Terlambat": terlambat,
        "Total Izin/Sakit": izinSakit,
        "Total Alpa": alpa,
        "Status Keaktifan": totalKehadiran >= 24 ? "Aktif" : "Perlu Perhatian",
      };
    })
    .sort((a, b) => b["Total Poin"] - a["Total Poin"]);
}
