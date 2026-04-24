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
  const [classes, promotions, allPembina] = await Promise.all([
    getClassesWithDetails(),
    getPromotionSuggestions(),
    getAvailablePembina(),
  ]);

  return (
    <ClassManagementUI
      classes={classes}
      promotions={promotions}
      allPembina={allPembina}
    />
  );
}
