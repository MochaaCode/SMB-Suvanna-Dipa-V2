import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ROLE_MAP: Record<string, { path: string; dash: string }> = {
  admin: { path: "/admin", dash: "/admin/dashboard" },
  pembina: { path: "/pembina", dash: "/pembina/dashboard" },
  siswa: { path: "/siswa", dash: "/siswa/dashboard" },
};

export async function middleware(req: NextRequest) {
  const { supabaseResponse, user } = await updateSession(req);
  const urlPath = req.nextUrl.pathname;
  const isProtected = ["/admin", "/pembina", "/siswa"].some((p) =>
    urlPath.startsWith(p),
  );

  if (!user && isProtected)
    return NextResponse.redirect(new URL("/login", req.url));

  if (user) {
    const config = ROLE_MAP[user.app_metadata?.role as string];
    if (
      config &&
      (urlPath === "/login" ||
        (isProtected && !urlPath.startsWith(config.path)))
    ) {
      return NextResponse.redirect(new URL(config.dash, req.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
