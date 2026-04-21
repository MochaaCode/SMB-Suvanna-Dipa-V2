import { Metadata } from "next";
import { getPembinaClasses } from "@/actions/teacher/classes";
import { PembinaClassManagement } from "@/components/teacher/classes/PembinaClassManagement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manajemen Kelas | Pembina",
};

export default async function PembinaClassesPage() {
  const classes = await getPembinaClasses();

  return <PembinaClassManagement classes={classes} />;
}
