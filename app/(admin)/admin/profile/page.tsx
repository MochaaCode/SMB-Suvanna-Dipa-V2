import { Metadata } from "next";
import { getOwnProfile } from "@/actions/shared/profile";

import { ProfileManagementUI } from "@/components/admin/profile/ProfileManagementUI";

export const metadata: Metadata = {
  title: "Profil Admin",
  description: "Kelola informasi profil admin Anda di SMB",
};

export default async function AdminProfilePage() {
  // Ambil data profil milik admin yang sedang login
  const profileData = await getOwnProfile();

  return <ProfileManagementUI initialProfile={profileData} />;
}
