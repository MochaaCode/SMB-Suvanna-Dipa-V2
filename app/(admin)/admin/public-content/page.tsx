import { Metadata } from "next";
import { getPublicContent } from "@/actions/admin/content";

import { ContentManagementUI } from "@/components/admin/content/ContentManagementUI";

export const metadata: Metadata = {
  title: "Manajemen Konten Publik",
  description:
    "Kelola konten publik yang ditampilkan di Landing Page utama SMB Suvanna Dipa",
};

export default async function PublicContentPage() {
  const contentData = await getPublicContent();

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <ContentManagementUI initialContent={contentData} />
    </div>
  );
}
