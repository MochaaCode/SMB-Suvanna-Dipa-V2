import { Metadata } from "next";
import { getOwnProfile } from "@/actions/shared/profile";
import { PembinaProfileManagementUI } from "@/components/pembina/profile/PembinaProfileManagement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pengaturan Akun | Pembina",
};

export default async function PembinaProfilePage() {
  const profileData = await getOwnProfile();

  return <PembinaProfileManagementUI initialProfile={profileData} />;
}
