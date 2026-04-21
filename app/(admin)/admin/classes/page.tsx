import { Metadata } from "next";
import {
  getClassesWithDetails,
  getPromotionSuggestions,
  getAvailablePembina,
} from "@/actions/admin/classes";

import { ClassManagementUI } from "@/components/admin/classes/ClassManagementUI";

export const metadata: Metadata = {
  title: "Manajemen Kelas",
  description: "Kelola kelas, promosi siswa, dan pembina di sistem.",
};

export default async function ClassesPage() {
  // Parallel Data Fetching
  const [classes, promotions, allPembina] = await Promise.all([
    getClassesWithDetails(),
    getPromotionSuggestions(),
    getAvailablePembina(),
  ]);

  return (
    // Hilangkan div wrapper p-6 max-w-7xl mx-auto karena sudah ditangani Layout
    <ClassManagementUI
      classes={classes}
      promotions={promotions}
      allPembina={allPembina}
    />
  );
}
