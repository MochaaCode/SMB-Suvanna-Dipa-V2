import { Metadata } from "next";
import { getOwnProfile } from "@/actions/shared/profile";
import { StudentProfileManagementUI } from "@/components/siswa/profile/StudentProfileManagement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pengaturan Profil | Portal Siswa",
  description: "Kelola informasi profil siswa Anda di SMB",
};

export default async function StudentProfilePage() {
  const profileData = await getOwnProfile();

  return <StudentProfileManagementUI initialProfile={profileData} />;
}
