import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    if (req.headers.get("x-api-secret") !== process.env.ESP32_SECRET_KEY) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data } = await supabase
      .from("device_states")
      .select("mode")
      .eq("id", "main_scanner")
      .single();

    return NextResponse.json({ success: true, mode: data?.mode || "scan" });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: (err as Error).message },
      { status: 500 },
    );
  }
}
