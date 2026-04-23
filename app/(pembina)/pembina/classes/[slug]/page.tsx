/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import { getClassDetailBySlug } from "@/actions/pembina/class-detail";
import { ClassDetailManagement } from "@/components/teacher/classes/detail/ClassDetailManagement";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Detail Kelas | Pembina",
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ClassDetailPage({ params }: PageProps) {
  const resolvedParams = await params;

  let data: any;

  try {
    data = await getClassDetailBySlug(resolvedParams.slug);
  } catch (error) {
    redirect("/pembina/classes");
  }

  return (
    <ClassDetailManagement
      classInfo={data.classInfo}
      students={data.students}
    />
  );
}
