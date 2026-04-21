/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  ShieldCheck,
  Mail,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import {
  toggleDeleteUsers,
  updateCredentials,
  hardDeleteUsers,
} from "@/actions/admin/users";
import { UserDetailModal } from "./UserDetailModal";
import { EditUserModal } from "./EditUserModal";
import { AppButton } from "../../shared/AppButton";
import { AppModal } from "../../shared/AppModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

import type { ProfileWithEmailAndClass } from "@/app/(admin)/admin/users/page";
import type { Class } from "@/types";

interface UserTableProps {
  users: ProfileWithEmailAndClass[];
  isTrashMode?: boolean;
  classes: Class[];
}

export function UserTable({
  users,
  isTrashMode = false,
  classes,
}: UserTableProps) {
  const [targetUser, setTargetUser] = useState<ProfileWithEmailAndClass | null>(
    null,
  );
  const [modalType, setModalType] = useState<
    "soft-delete" | "restore" | "hard-delete" | "credentials" | null
  >(null);
  const [activeTab, setActiveTab] = useState<"email" | "password">("email");
  const [inputValue, setInputValue] = useState("");
  const [isPending, setIsPending] = useState(false);

  const [viewUser, setViewUser] = useState<ProfileWithEmailAndClass | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ProfileWithEmailAndClass | null>(
    null,
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(users.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [users]);

  const closeModal = () => {
    setTargetUser(null);
    setModalType(null);
    setInputValue("");
  };

  const executeAction = async () => {
    if (!targetUser || !modalType) return;
    const tid = toast.loading("Memproses...");
    setIsPending(true);
    try {
      if (modalType === "credentials") {
        const payload =
          activeTab === "email"
            ? { email: inputValue }
            : { password: inputValue };
        await updateCredentials(targetUser.id, payload);
        toast.success(
          `${activeTab === "email" ? "Email" : "Password"} berhasil diperbarui!`,
          { id: tid },
        );
      } else {
        switch (modalType) {
          case "soft-delete":
            await toggleDeleteUsers([targetUser.id], true);
            toast.success("Pengguna dipindahkan ke tempat sampah.", {
              id: tid,
            });
            break;
          case "restore":
            await toggleDeleteUsers([targetUser.id], false);
            toast.success("Pengguna berhasil dipulihkan.", { id: tid });
            break;
          case "hard-delete":
            if (inputValue !== "HAPUS") throw new Error("Konfirmasi salah!");
            await hardDeleteUsers([targetUser.id]);
            toast.success("Pengguna dihapus permanen.", { id: tid });
            break;
        }
      }
      closeModal();
    } catch (error: any) {
      toast.error(error.message, { id: tid });
    } finally {
      setIsPending(false);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader
            className={isTrashMode ? "bg-red-50" : "bg-orange-50/50"}
          >
            <TableRow className="border-slate-200">
              <TableHead className="w-24 text-center text-xs font-bold uppercase tracking-wider text-slate-500 py-4">
                Profil
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 py-4">
                Identitas
              </TableHead>
              <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 py-4">
                Status & Poin
              </TableHead>
              <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-slate-500 py-4">
                Kelas
              </TableHead>
              <TableHead className="w-44 text-center text-xs font-bold uppercase tracking-wider text-slate-500 py-4">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-slate-400 font-medium text-sm"
                >
                  Data tidak ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => {
                const displayName =
                  !user.full_name || user.full_name === "NULL"
                    ? "Tanpa Nama"
                    : user.full_name;

                const classData = user.classes;

                return (
                  <TableRow
                    key={user.id}
                    className="group hover:bg-slate-50/50 transition-colors border-b border-slate-100"
                  >
                    <TableCell className="text-center">
                      <Avatar className="h-10 w-10 border border-slate-200 shadow-sm mx-auto group-hover:scale-105 transition-transform">
                        <AvatarImage src={user.avatar_url || ""} />
                        <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-xs">
                          {displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>

                    <TableCell className="text-left">
                      <p className="text-sm font-bold text-slate-800 leading-tight mb-1">
                        {displayName}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                        <Mail size={12} className="text-slate-400" />{" "}
                        {user.email}
                      </p>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            user.role === "admin"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : user.role === "pembina"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-green-50 text-green-700 border-green-200"
                          }`}
                        >
                          {user.role || "siswa"}
                        </span>
                        <div className="flex items-center gap-1 font-bold text-orange-600 text-xs">
                          <Star size={12} fill="currentColor" />{" "}
                          {(user.points || 0).toLocaleString()}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      {classData?.name ? (
                        <Badge className="bg-slate-100 text-slate-700 rounded-md font-bold uppercase text-[10px] border border-slate-200 shadow-none">
                          {classData.name}
                        </Badge>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400">
                          -
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center gap-2">
                        {!isTrashMode ? (
                          <>
                            <AppButton
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50 bg-white border border-slate-200"
                              onClick={() => {
                                setTargetUser(user);
                                setModalType("credentials");
                              }}
                              title="Kredensial"
                            >
                              <ShieldCheck size={14} />
                            </AppButton>
                            <AppButton
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 text-slate-600 hover:text-slate-900 bg-white border border-slate-200"
                              onClick={() => {
                                setViewUser(user);
                                setIsDetailOpen(true);
                              }}
                              title="Lihat Detail"
                            >
                              <Eye size={14} />
                            </AppButton>
                            <AppButton
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 bg-white border border-slate-200"
                              onClick={() => {
                                setEditTarget(user);
                                setIsEditOpen(true);
                              }}
                              title="Edit Profil"
                            >
                              <Edit size={14} />
                            </AppButton>
                            <AppButton
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 bg-white border border-slate-200"
                              onClick={() => {
                                setTargetUser(user);
                                setModalType("soft-delete");
                              }}
                              title="Hapus"
                            >
                              <Trash2 size={14} />
                            </AppButton>
                          </>
                        ) : (
                          <div className="flex gap-2">
                            <AppButton
                              variant="secondary"
                              className="h-8 px-3 text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                              onClick={() => {
                                setTargetUser(user);
                                setModalType("restore");
                              }}
                              leftIcon={<RotateCcw size={14} />}
                            >
                              Pulihkan
                            </AppButton>
                            <AppButton
                              variant="red"
                              className="h-8 px-3 text-xs"
                              onClick={() => {
                                setTargetUser(user);
                                setModalType("hard-delete");
                              }}
                              leftIcon={<ShieldAlert size={14} />}
                            >
                              Hapus Permanen
                            </AppButton>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200 mt-auto">
        <p className="text-xs font-medium text-slate-500">
          Menampilkan{" "}
          <span className="font-bold text-slate-900">
            {users.length === 0 ? 0 : startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, users.length)}
          </span>{" "}
          dari {users.length} data
        </p>
        <div className="flex gap-2">
          <AppButton
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </AppButton>
          <AppButton
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight size={16} />
          </AppButton>
        </div>
      </div>

      <AppModal
        isOpen={modalType === "credentials"}
        onClose={closeModal}
        title="Pengaturan Akses"
        description={`Mengelola kredensial untuk ${targetUser?.full_name}`}
        variant="orange"
        footer={
          <>
            <AppButton
              variant="outline"
              onClick={closeModal}
              disabled={isPending}
            >
              Batal
            </AppButton>
            <AppButton
              onClick={executeAction}
              isLoading={isPending}
              disabled={!inputValue}
              variant="default"
            >
              Simpan Perubahan
            </AppButton>
          </>
        }
      >
        <Tabs
          value={activeTab}
          onValueChange={(value: any) => {
            setActiveTab(value);
            setInputValue("");
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-lg mb-6">
            <TabsTrigger
              value="email"
              className="text-xs font-bold data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-md transition-all"
            >
              Ubah Email
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="text-xs font-bold data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-md transition-all"
            >
              Reset Sandi
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="email"
            className="space-y-2 text-left outline-none m-0"
          >
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Alamat Email Baru
            </Label>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="user@smb.com"
              className="h-11 rounded-lg border-slate-200 bg-white font-medium focus-visible:ring-orange-500"
            />
          </TabsContent>
          <TabsContent
            value="password"
            className="space-y-2 text-left outline-none m-0"
          >
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kata Sandi Baru (Min. 6 Karakter)
            </Label>
            <Input
              type="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="••••••"
              className="h-11 rounded-lg border-slate-200 bg-white font-medium focus-visible:ring-orange-500"
            />
          </TabsContent>
        </Tabs>
      </AppModal>

      <AlertDialog
        open={["soft-delete", "restore", "hard-delete"].includes(
          modalType as string,
        )}
        onOpenChange={closeModal}
      >
        <AlertDialogContent className="rounded-[1rem] p-8 border-slate-200 shadow-xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-800">
              {modalType === "hard-delete"
                ? "Hapus Permanen?"
                : "Konfirmasi Aksi"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-slate-600 mt-2">
              {modalType === "hard-delete" && (
                <div className="space-y-4">
                  <p className="text-red-600 font-bold leading-relaxed bg-red-50 p-3 rounded-lg border border-red-100">
                    Peringatan: Data profil dan akses login akan dihapus secara
                    permanen dari database. Aksi ini tidak dapat dibatalkan.
                  </p>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500">
                      Ketik <span className="text-slate-900">HAPUS</span> untuk
                      melanjutkan
                    </Label>
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="HAPUS"
                      className="h-10 rounded-lg border-slate-200 text-center font-bold focus-visible:ring-red-500"
                    />
                  </div>
                </div>
              )}
              {modalType === "soft-delete" && (
                <span>
                  Pindahkan <strong>{targetUser?.full_name}</strong> ke tempat
                  sampah sementara? Data masih bisa dipulihkan nanti.
                </span>
              )}
              {modalType === "restore" && (
                <span>
                  Aktifkan kembali akun <strong>{targetUser?.full_name}</strong>{" "}
                  ke dalam sistem?
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel asChild>
              <AppButton
                variant="outline"
                onClick={closeModal}
                disabled={isPending}
                className="h-10 text-xs"
              >
                Batal
              </AppButton>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <AppButton
                variant={modalType === "restore" ? "default" : "red"}
                onClick={executeAction}
                isLoading={isPending}
                disabled={
                  isPending ||
                  (modalType === "hard-delete" && inputValue !== "HAPUS")
                }
                className="h-10 text-xs"
              >
                Ya, Eksekusi
              </AppButton>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UserDetailModal
        user={viewUser}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setViewUser(null);
        }}
      />
      <EditUserModal
        user={editTarget}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditTarget(null);
        }}
        classes={classes}
      />
    </div>
  );
}
