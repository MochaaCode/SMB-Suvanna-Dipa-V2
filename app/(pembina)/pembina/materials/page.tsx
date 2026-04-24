import { Metadata } from "next";
import { getPembinaMaterials } from "@/actions/pembina/materials";
import { MaterialManagement } from "@/components/pembina/materials/MaterialManagement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Materi Pembahasan | Pembina",
};

export default async function MaterialsPage() {
  const materials = await getPembinaMaterials();

  return <MaterialManagement materials={materials} />;
}
