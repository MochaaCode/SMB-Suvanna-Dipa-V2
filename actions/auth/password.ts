"use server";

import { createClient } from "@/lib/supabase/server";

export async function forgotPasswordAction(email: string) {
  if (!email) return { success: false, error: "Email wajib diisi." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  return error ? { success: false, error: error.message } : { success: true };
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
    return {
      success: false,
      error: "Token tidak valid atau sudah kedaluwarsa.",
    };

  const { error: updateError } = await supabase.auth.updateUser({
    password: data.newPass,
  });

  if (updateError) return { success: false, error: updateError.message };
  await supabase.auth.signOut();

  return { success: true };
}
