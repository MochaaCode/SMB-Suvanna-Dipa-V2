import { Metadata } from "next";
import { getMyClassData } from "@/actions/pembina/my-class";
import { MyClassManagement } from "@/components/pembina/my-class/MyClassManagement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kelas Saya | Pembina",
};

export default async function MyClassPage() {
  const data = await getMyClassData();
  return <MyClassManagement data={data} />;
}
