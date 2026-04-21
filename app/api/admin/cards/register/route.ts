import { registerNewCard } from "@/actions/admin/cards";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (req.headers.get("x-api-secret") !== process.env.ESP32_SECRET_KEY)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { uid } = await req.json();
    if (!uid)
      return NextResponse.json(
        { success: false, message: "UID nihil" },
        { status: 400 },
      );

    const result = await registerNewCard(uid.toUpperCase());
    return NextResponse.json(
      { success: true, message: `Kartu ${uid} didaftarkan`, data: result },
      { status: 200 },
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: (err as Error).message },
      { status: 500 },
    );
  }
}
