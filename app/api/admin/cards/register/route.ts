import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    if (req.headers.get("x-api-secret") !== process.env.ESP32_SECRET_KEY) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { uid } = await req.json();
    if (!uid) {
      return NextResponse.json(
        { success: false, message: "UID nihil / kosong" },
        { status: 400 },
      );
    }

    const formattedUid = uid.toUpperCase();
    const supabase = createAdminClient();

    const { data: existingCard } = await supabase
      .from("rfid_tags")
      .select("uid")
      .eq("uid", formattedUid)
      .maybeSingle();

    if (existingCard) {
      return NextResponse.json(
        { success: false, message: `Kartu ${formattedUid} sudah terdaftar!` },
        { status: 409 },
      );
    }

    const { error: insertError } = await supabase.from("rfid_tags").insert({
      uid: formattedUid,
      status: "tersedia",
    });

    if (insertError) throw new Error(insertError.message);

    return NextResponse.json(
      { success: true, message: `Kartu ${formattedUid} berhasil didaftarkan` },
      { status: 200 },
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: (err as Error).message },
      { status: 500 },
    );
  }
}
