/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function forgotPasswordAction(email: string) {
  if (!email) return { success: false, error: "Email wajib diisi." };

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) return { success: false, error: error.message };

    // BUSINESS LOGIC: Catat ke Audit Trail (Log Keamanan)
    try {
      const supabaseAdmin = createAdminClient();

      // Ambil max 1000 user untuk dicocokkan (aman buat skala SMB lu)
      const {
        data: { users },
      } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      const targetUser = users.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase(),
      );

      await supabaseAdmin.from("password_reset_tokens").insert({
        email: email,
        user_id: targetUser?.id || null, // Otomatis NULL kalau email fiktif
        token: "SECURE_OTP_REQUESTED",
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        is_used: false,
      });
    } catch (Error) {
      // Silent error, jangan ganggu UX utama walaupun pencatatan log gagal
    }

    return { success: true };
  } catch (Error: any) {
    return { success: false, error: "Terjadi gangguan sistem internal." };
  }
}

export async function verifyOtpAndResetPassword(data: {
  email: string;
  token: string;
  newPass: string;
}) {
  const supabase = await createClient();

  const { error: otpError } = await supabase.auth.verifyOtp({
    email: data.email,
    token: data.token,
    type: "recovery",
  });

  if (otpError)
    return { success: false, error: "Token tidak valid atau kedaluwarsa." };

  const { error: updateError } = await supabase.auth.updateUser({
    password: data.newPass,
  });

  if (updateError) return { success: false, error: updateError.message };

  try {
    const supabaseAdmin = createAdminClient();
    await supabaseAdmin
      .from("password_reset_tokens")
      .update({ is_used: true })
      .eq("email", data.email)
      .eq("is_used", false);
  } catch (error) {
    // Silent error
  }

  await supabase.auth.signOut();
  return { success: true };
}
