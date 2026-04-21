"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Fingerprint, Monitor } from "lucide-react";

// IMPORT TIPE
import type { AttendanceLogWithProfile } from "@/types";

interface AttendanceTableProps {
  initialLogs: AttendanceLogWithProfile[];
  scheduleId: number;
}

export default function AttendanceTable({
  initialLogs,
  scheduleId,
}: AttendanceTableProps) {
  const [logs, setLogs] = useState<AttendanceLogWithProfile[]>(initialLogs);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("live-attendance")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "attendance_logs",
          filter: `schedule_id=eq.${scheduleId}`,
        },
        async (payload) => {
          const { data: newLog } = await supabase
            .from("attendance_logs")
            .select("*, profiles:profile_id(full_name, role)")
            .eq("id", payload.new.id)
            .single();

          if (newLog) {
            setLogs((prev) => [newLog as AttendanceLogWithProfile, ...prev]);
            router.refresh();
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [scheduleId, supabase, router]);

  useEffect(() => {
    setLogs(initialLogs);
  }, [initialLogs]);

  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <TableHeader className="bg-white">
          <TableRow className="border-slate-100 hover:bg-transparent">
            <TableHead className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-center w-16">
              No
            </TableHead>
            <TableHead className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-500">
              Nama Siswa
            </TableHead>
            <TableHead className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-center">
              Waktu Scan
            </TableHead>
            <TableHead className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-center">
              Status
            </TableHead>
            <TableHead className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-500 text-center">
              Metode
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-48 text-center text-slate-400 font-medium text-sm"
              >
                Belum ada aktivitas presensi terdeteksi...
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log, index) => (
              <TableRow
                key={log.id}
                className="group hover:bg-orange-50/50 border-b border-slate-100 transition-colors animate-in slide-in-from-top-2 duration-500"
              >
                <TableCell className="px-6 py-4 text-center font-bold text-slate-400 text-xs">
                  {(index + 1).toString().padStart(2, "0")}
                </TableCell>

                <TableCell className="px-6 py-4">
                  <span className="font-bold text-slate-800 text-sm group-hover:text-orange-600 transition-colors">
                    {log.profiles?.full_name || "Siswa Tidak Ditemukan"}
                  </span>
                </TableCell>

                <TableCell className="px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-md font-semibold text-xs text-slate-600 shadow-sm">
                    {new Date(log.scan_time).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    WIB
                  </div>
                </TableCell>

                <TableCell className="px-6 py-4 text-center">
                  <Badge
                    className={`
                      ${log.status === "hadir" ? "bg-green-50 text-green-700 border-green-200" : ""}
                      ${log.status === "terlambat" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
                      ${log.status === "alpa" ? "bg-red-50 text-red-700 border-red-200" : ""}
                      ${log.status === "izin" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                      px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-none border
                    `}
                  >
                    {log.status}
                  </Badge>
                </TableCell>

                <TableCell className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {log.method === "rfid" ? (
                      <Fingerprint size={14} className="text-orange-500" />
                    ) : (
                      <Monitor size={14} className="text-blue-500" />
                    )}
                    {log.method}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
