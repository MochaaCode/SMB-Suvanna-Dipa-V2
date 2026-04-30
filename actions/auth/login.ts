"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loginSchema, type LoginInput } from "@/lib/validations/auth/login";
import { revalidatePath } from "next/cache";

export async function loginAction(formData: LoginInput) {
  const validatedFields = loginSchema.safeParse(formData);
  if (!validatedFields.success)
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };

  const { email, password } = validatedFields.data;
  const supabase = await createClient();

  // Step 1: Validasi credential
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });
  if (authError) return { success: false, error: "Email atau password salah." };

  // Step 2: Ambil profile (role)
  const supabaseAdmin = createAdminClient();
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (!profile) {
    await supabase.auth.signOut();
    return { success: false, error: "Profil tidak ditemukan." };
  }

  // Step 3: Login berhasil, langsung masuk
  revalidatePath("/", "layout");
  return { success: true, role: profile.role };
}

// MFA dinonaktifkan sementara — export dipertahankan agar tidak break build
export async function verifyOtpAction(_email: string, _token: string) {
  return { success: false, error: "MFA sedang dinonaktifkan." };
}

export async function resendOtpAction(_email: string) {
  return { success: false, error: "MFA sedang dinonaktifkan." };
}
