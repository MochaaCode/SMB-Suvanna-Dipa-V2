"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceRoleClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

import type { Profile, UserRole } from "@/types";

export interface BulkUserPayload {
  email: string;
  password?: string;
  full_name: string;
  role?: UserRole;
  points?: number;
  birth_date?: string | number | null;
  [key: string]: string | number | boolean | null | undefined;
}

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Sesi berakhir, silakan login kembali.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Akses ditolak: Anda bukan admin.");
  }
  return supabase;
}

/**
 * 1. SINGLE UPSERT (Tambah/Edit Satu User) - DIPERBAIKI
 */
export async function upsertUser(
  formData: Partial<Profile> & { email?: string; password?: string },
) {
  await ensureAdmin();
  const supabaseAdmin = createServiceRoleClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { email, password, ...profileData } = formData;

  if (profileData.role === "pembina" || profileData.role === "admin") {
    profileData.class_id = null;
  }

  let targetId = profileData.id;

  if (!targetId) {
    if (!email || !password)
      throw new Error("Email dan Password wajib untuk user baru.");

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: profileData.full_name },
      });

    if (authError)
      throw new Error("Gagal mendaftarkan autentikasi: " + authError.message);
    targetId = authData.user.id;
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ ...profileData, updated_at: new Date().toISOString() })
    .eq("id", targetId);

  if (error) throw new Error("Gagal simpan profil: " + error.message);

  revalidatePath("/admin/users");
  revalidatePath("/admin/classes");
  return { success: true };
}

/**
 * 2. TOGGLE DELETE (Soft Delete & Recovery)
 */
export async function toggleDeleteUsers(userIds: string[], status: boolean) {
  const supabase = await ensureAdmin();

  const { error } = await supabase
    .from("profiles")
    .update({ is_deleted: status })
    .in("id", userIds);

  if (error) throw new Error("Gagal update status: " + error.message);

  revalidatePath("/admin/users");
  return { success: true };
}

/**
 * 3. BULK CREATE ACCOUNTS (Dengan Rollback System)
 */
export async function bulkCreateAccounts(usersData: BulkUserPayload[]) {
  await ensureAdmin();

  const supabaseAdmin = createServiceRoleClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const excelToDate = (serial: string | number | null | undefined) => {
    if (!serial || serial === "NULL" || typeof serial !== "number")
      return serial;
    const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
    return date.toISOString().split("T")[0];
  };

  const summary = { success: 0, failed: 0, errors: [] as string[] };

  for (const userData of usersData) {
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: { full_name: userData.full_name },
      });

    if (authError) {
      summary.failed++;
      summary.errors.push(`${userData.email}: ${authError.message}`);
      continue;
    }

    if (authData.user) {
      const { email, password, id: _, ...rawProfileData } = userData;

      const profileData = Object.fromEntries(
        Object.entries(rawProfileData).map(([key, value]) => {
          if (key === "birth_date")
            return [key, excelToDate(value as string | number)];
          return [key, value === "NULL" ? null : value];
        }),
      );

      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({
          ...profileData,
          id: authData.user.id,
          is_deleted: false,
        })
        .eq("id", authData.user.id);

      if (profileError) {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        summary.failed++;
        summary.errors.push(
          `${userData.email}: Gagal simpan profil, akun auth dibatalkan.`,
        );
      } else {
        summary.success++;
      }
    }
  }

  revalidatePath("/admin/users");
  return summary;
}

/**
 * 4. UPDATE KREDENSIAL (Email/Password)
 */
export async function updateCredentials(
  userId: string,
  updates: { email?: string; password?: string },
) {
  await ensureAdmin();

  const supabaseAdmin = createServiceRoleClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    updates,
  );

  if (error) throw new Error("Gagal update kredensial: " + error.message);

  revalidatePath("/admin/users");
  return { success: true };
}

/**
 * 5. HARD DELETE (Hapus Akun Auth & Profile)
 */
export async function hardDeleteUsers(userIds: string[]) {
  await ensureAdmin();

  const supabaseAdmin = createServiceRoleClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  for (const id of userIds) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error)
      throw new Error(`Gagal hapus permanen ID ${id}: ${error.message}`);
  }

  revalidatePath("/admin/users");
  return { success: true };
}

/**
 * 6. AMBIL SEMUA EMAIL
 */
export async function getAllUserEmails() {
  await ensureAdmin();

  const supabaseAdmin = createServiceRoleClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const {
    data: { users },
    error,
  } = await supabaseAdmin.auth.admin.listUsers({
    perPage: 1000,
  });

  if (error) throw new Error(error.message);

  const emailMap: Record<string, string> = {};
  users.forEach((u) => {
    emailMap[u.id] = u.email || "";
  });

  return emailMap;
}
