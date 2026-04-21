import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { getTodaySchedule } from "@/actions/admin/schedules";

export async function POST(req: Request) {
  try {
    if (req.headers.get("x-api-secret") !== process.env.ESP32_SECRET_KEY)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );

    const { uid } = await req.json();
    const supabase = createAdminClient();

    const { data: card } = await supabase
      .from("rfid_tags")
      .select(`*, profiles (id, full_name, role)`)
      .eq("uid", uid)
      .eq("is_deleted", false)
      .single();

    if (!card)
      return NextResponse.json(
        { success: false, message: "Kartu tidak terdaftar/nonaktif" },
        { status: 404 },
      );

    const user = card.profiles;
    if (!user)
      return NextResponse.json(
        { success: false, message: "Kartu belum dipasangkan" },
        { status: 400 },
      );
    if (user.role === "admin")
      return NextResponse.json({
        success: true,
        message: "Halo Admin!",
        name: user.full_name,
        action: "admin_mode",
      });

    const schedule = await getTodaySchedule();
    if (!schedule)
      return NextResponse.json(
        { success: false, message: "Presensi Belum Dibuka" },
        { status: 403 },
      );

    const { data: existingLog } = await supabase
      .from("attendance_logs")
      .select("id")
      .eq("profile_id", user.id)
      .eq("schedule_id", schedule.id)
      .maybeSingle();
    if (existingLog)
      return NextResponse.json(
        { success: false, message: "Sudah Absen!", name: user.full_name },
        { status: 409 },
      );

    const jkt = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
    );
    const timeValue = jkt.getHours() * 100 + jkt.getMinutes();

    if (timeValue > 1100)
      return NextResponse.json(
        { success: false, message: "Sesi Sudah Berakhir" },
        { status: 403 },
      );

    const status = timeValue <= 930 ? "hadir" : "terlambat";
    const { error: insertErr } = await supabase.from("attendance_logs").insert({
      profile_id: user.id,
      schedule_id: schedule.id,
      rfid_uid: uid,
      status,
      method: "rfid",
      notes: status === "terlambat" ? "Otomatis (lewat 09:30)" : "Tepat waktu",
    });

    if (insertErr) throw insertErr;
    return NextResponse.json({
      success: true,
      message: status === "hadir" ? "Berhasil Hadir!" : "Anda Terlambat!",
      name: user.full_name,
      status,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: (err as Error).message },
      { status: 500 },
    );
  }
}
