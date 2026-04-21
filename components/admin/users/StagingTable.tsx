/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { bulkCreateAccounts } from "@/actions/admin/users";
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Save,
  XCircle,
  Database,
} from "lucide-react";
import { AppButton } from "../../shared/AppButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";

import type { BulkUserPayload } from "@/actions/admin/users";

interface StagingTableProps {
  data: BulkUserPayload[];
  onCancel: () => void;
  onSuccess: () => void;
}

export function StagingTable({ data, onCancel, onSuccess }: StagingTableProps) {
  const [draft, setDraft] = useState<BulkUserPayload[]>(data);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleUpdate = (idx: number, key: string, val: string | number) => {
    setDraft((prev) => {
      const newDraft = [...prev];
      newDraft[idx] = { ...newDraft[idx], [key]: val };
      return newDraft;
    });
  };

  const handleFinalSubmit = async () => {
    setIsConfirmOpen(false);
    setLoading(true);
    const tid = toast.loading(`Mendaftarkan ${draft.length} akun ke sistem...`);
    try {
      const result = await bulkCreateAccounts(draft);
      toast.success(`${result.success} Akun Berhasil Dibuat!`, { id: tid });
      if (result.failed > 0) {
        toast.error(
          `${result.failed} Data gagal diproses. Silakan periksa email yang duplikat.`,
          {
            duration: 6000,
          },
        );
      }
      onSuccess();
    } catch (error: any) {
      toast.error("Gagal Sinkronisasi: " + error.message, { id: tid });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 bg-orange-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 rounded-lg text-orange-700 border border-orange-200">
            <AlertCircle size={20} />
          </div>
          <div className="text-left">
            <h3 className="text-base font-bold text-slate-800 leading-tight">
              Pemeriksaan Data Excel
            </h3>
            <p className="text-[11px] font-semibold text-orange-700 mt-0.5 uppercase tracking-wider">
              Tinjau dan perbaiki {draft.length} baris data sebelum diimpor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <AppButton
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="h-10 text-xs"
            leftIcon={<XCircle size={16} className="text-slate-400" />}
          >
            Batalkan
          </AppButton>
          <AppButton
            onClick={() => setIsConfirmOpen(true)}
            isLoading={loading}
            variant="default"
            className="h-10 text-xs"
            leftIcon={<Save size={16} />}
          >
            Sinkronisasi Database
          </AppButton>
        </div>
      </div>

      <div className="overflow-x-auto p-4 pt-0">
        <Table className="border border-slate-200 rounded-lg overflow-hidden">
          <TableHeader className="bg-orange-50">
            <TableRow className="border-slate-200">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-orange-800 py-4 px-4 min-w-50">
                Nama Lengkap
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-orange-800 py-4 min-w-50">
                Email Login
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-orange-800 py-4 min-w-37.5">
                Password
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-orange-800 py-4 w-28">
                Poin
              </TableHead>
              <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-orange-800 py-4 w-40">
                Status Data
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {draft.map((item, idx) => (
              <TableRow
                key={idx}
                className="group border-b border-slate-100 hover:bg-orange-50/30 transition-colors"
              >
                <TableCell className="px-4 py-2">
                  <Input
                    value={item.full_name || ""}
                    onChange={(e) =>
                      handleUpdate(idx, "full_name", e.target.value)
                    }
                    className="h-9 rounded-md border-slate-200 bg-white font-medium text-sm focus-visible:ring-orange-500"
                  />
                </TableCell>
                <TableCell className="py-2">
                  <Input
                    value={item.email || ""}
                    onChange={(e) => handleUpdate(idx, "email", e.target.value)}
                    className="h-9 rounded-md border-slate-200 bg-white font-medium text-sm focus-visible:ring-orange-500"
                  />
                </TableCell>
                <TableCell className="py-2">
                  <Input
                    value={item.password || ""}
                    onChange={(e) =>
                      handleUpdate(idx, "password", e.target.value)
                    }
                    className="h-9 rounded-md border-slate-200 bg-white font-mono text-sm text-slate-600 focus-visible:ring-orange-500"
                  />
                </TableCell>
                <TableCell className="py-2">
                  <Input
                    type="number"
                    value={item.points || 0}
                    onChange={(e) =>
                      handleUpdate(idx, "points", parseInt(e.target.value) || 0)
                    }
                    className="h-9 rounded-md border-slate-200 bg-white font-medium text-sm text-center focus-visible:ring-orange-500"
                  />
                </TableCell>
                <TableCell className="text-center py-2">
                  {item.address && item.address !== "NULL" ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-md border border-green-200">
                      <CheckCircle2 size={12} />{" "}
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Lengkap
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                      <HelpCircle size={12} />{" "}
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Inti Saja
                      </span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-[1rem] p-8 border-slate-200 shadow-xl max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-orange-600 rounded-lg text-white">
                <Database size={20} />
              </div>
              <AlertDialogTitle className="text-xl font-bold text-slate-800">
                Konfirmasi Import
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm font-medium text-slate-600 leading-relaxed text-left">
              Sistem akan memproses pendaftaran{" "}
              <span className="font-bold text-slate-900">
                {draft.length} pengguna
              </span>{" "}
              sekaligus. <br />
              <br />
              Akun autentikasi login (Auth) dan profil database akan dibuat.
              Pastikan Anda sudah meninjau data di tabel (terutama email agar
              tidak duplikat). <br />
              <br />
              <span className="text-orange-600 font-bold">
                Lanjutkan sinkronisasi sekarang?
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel asChild>
              <AppButton
                variant="outline"
                onClick={() => setIsConfirmOpen(false)}
                className="h-10 text-xs"
              >
                Batal
              </AppButton>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <AppButton
                onClick={handleFinalSubmit}
                className="h-10 text-xs"
                variant="default"
              >
                Ya, Sinkronkan
              </AppButton>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
