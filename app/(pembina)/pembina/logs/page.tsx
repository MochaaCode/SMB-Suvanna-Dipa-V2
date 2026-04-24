/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  getPembinaActivityLogs,
  PembinaLogsData,
} from "@/actions/pembina/logs";
import { PembinaLogsManagement } from "@/components/pembina/logs/PembinaLogsManagement";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Riwayat Aktivitas | Pembina",
};

export default async function PembinaLogsPage() {
  let data: PembinaLogsData;

  try {
    data = await getPembinaActivityLogs();
  } catch (error: any) {
    if (error.message === "FORBIDDEN_ROLE") {
      redirect("/siswa/activity");
    }
    redirect("/pembina/dashboard");
  }

  return <PembinaLogsManagement data={data} />;
}
