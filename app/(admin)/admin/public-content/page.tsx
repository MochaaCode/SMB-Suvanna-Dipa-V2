import { Metadata } from "next";
import { getPublicContent } from "@/actions/admin/content";

import { ContentManagementUI } from "@/components/admin/content/ContentManagementUI";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Manajemen Konten Publik",
  description:
    "Kelola konten publik yang ditampilkan di Landing Page utama SMB Suvanna Dipa",
};

export default async function PublicContentPage() {
  // 1. Ambil semua blok konten publik dari database (CMS)
  const contentData = await getPublicContent();

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* COMPONENT UTAMA */}
      <ContentManagementUI initialContent={contentData} />

      {/* FOOTER INFO: WARNING BOX */}
      <div className="bg-orange-50 border border-orange-200 p-5 rounded-[1rem] flex flex-col sm:flex-row items-center sm:items-start gap-4 shadow-sm mt-8">
        <div className="p-3 bg-white rounded-lg text-orange-600 shrink-0 shadow-sm border border-orange-100">
          <AlertTriangle size={20} />
        </div>
        <div className="space-y-1.5 text-center sm:text-left">
          <h4 className="text-sm font-bold text-orange-800">Perhatian Admin</h4>
          <p className="text-[11px] font-medium text-orange-700 leading-relaxed">
            Perubahan pada konten di atas akan langsung mengubah tampilan
            Landing Page utama SMB Suvanna Dipa secara Real-Time. Pastikan data
            (terutama URL Gambar) sudah valid sebelum menekan tombol{" "}
            <span className="font-bold underline">Simpan Perubahan</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
