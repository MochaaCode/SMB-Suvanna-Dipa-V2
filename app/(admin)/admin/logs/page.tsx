import { Metadata } from "next";
import { getStudentsSummary } from "@/actions/admin/logs";

import { LogManagementUI } from "@/components/admin/logs/LogManagementUI";

export const metadata: Metadata = {
  title: "Log Riwayat Siswa",
  description:
    "Lihat dan kelola log kehadiran, poin, dan transaksi siswa secara menyeluruh",
};

export default async function LogsPage() {
  const students = await getStudentsSummary();

  return (
    <LogManagementUI students={students} />
  );
}
