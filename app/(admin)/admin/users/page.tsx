/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { UserManagementUI } from "@/components/admin/users/UserManagementUI";
import { getAllUserEmails } from "@/actions/admin/users";

import type { Profile, Class } from "@/types";

export const metadata: Metadata = {
  title: "Manajemen Pengguna",
  description: "Kelola pengguna dan akses di sistem",
};

export interface ProfileWithEmailAndClass extends Profile {
  email: string;
  classes?: { name: string } | null;
}

export default async function UsersPage() {
  const supabase = await createClient();

  const [profilesRes, emailMap, classesRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("*, classes!class_id(name)")
      .order("created_at", { ascending: false }),
    getAllUserEmails(),
    supabase.from("classes").select("id, name"),
  ]);

  if (profilesRes.error)
    return (
      <div className="p-10 text-red-500 text-center font-bold">
        Gagal memuat data: {profilesRes.error.message}
      </div>
    );

  const usersWithRealEmails: ProfileWithEmailAndClass[] = (
    profilesRes.data as unknown as Profile[]
  ).map((user) => ({
    ...user,
    email: emailMap[user.id] || "Email tidak ditemukan",
    classes: (user as any).classes,
  }));

  const classes = (classesRes.data as unknown as Class[]) || [];

  return (
    <UserManagementUI initialUsers={usersWithRealEmails} classes={classes} />
  );
}
