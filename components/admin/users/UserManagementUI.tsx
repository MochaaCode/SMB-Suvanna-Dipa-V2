"use client";

import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { UserTable } from "./UserTable";
import { AddUserModal } from "./AddUserModal";
import { StagingTable } from "./StagingTable";
import { AppCard } from "../../shared/AppCard";
import { PageHeader } from "../../shared/PageHeader";
import { AppButton } from "../../shared/AppButton";
import { Input } from "@/components/ui/input";
import { Users, Trash2, Plus, Search, ArrowLeft, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ProfileWithEmailAndClass } from "@/app/(admin)/admin/users/page";
import type { Class } from "@/types";
import type { BulkUserPayload } from "@/actions/admin/users";

interface UserManagementUIProps {
  initialUsers: ProfileWithEmailAndClass[];
  classes: Class[];
}

export function UserManagementUI({
  initialUsers,
  classes,
}: UserManagementUIProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftUsers, setDraftUsers] = useState<BulkUserPayload[]>([]);
  const [isTrashMode, setIsTrashMode] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("terbaru");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const processedUsers = useMemo(() => {
    let result = isTrashMode
      ? initialUsers.filter((u) => u.is_deleted)
      : initialUsers.filter((u) => !u.is_deleted);

    if (debouncedSearchQuery) {
      result = result.filter((u) =>
        u.full_name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    if (classFilter !== "all") {
      if (classFilter === "none") {
        result = result.filter((u) => !u.class_id);
      } else {
        result = result.filter((u) => String(u.class_id) === classFilter);
      }
    }

    if (sortOrder === "az") {
      result.sort((a, b) =>
        (a.full_name || "").localeCompare(b.full_name || ""),
      );
    } else if (sortOrder === "za") {
      result.sort((a, b) =>
        (b.full_name || "").localeCompare(a.full_name || ""),
      );
    }

    return result;
  }, [
    initialUsers,
    isTrashMode,
    debouncedSearchQuery,
    roleFilter,
    classFilter,
    sortOrder,
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <PageHeader
        title={isTrashMode ? "DATA" : "KELOLA"}
        highlightText={isTrashMode ? "DIHAPUS" : "PENGGUNA"}
        subtitle={
          isTrashMode
            ? "Data pengguna yang terhapus sementara."
            : "Kelola data akun siswa, pembina, dan admin."
        }
        icon={isTrashMode ? <Trash2 size={24} /> : <Users size={24} />}
        themeColor={isTrashMode ? "red" : "orange"}
      />

      <AppCard className="p-5 border-slate-200 shadow-sm rounded-[1rem] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <Input
              placeholder="Cari nama pengguna..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-10 rounded-[1rem] border-slate-200 bg-slate-50 font-medium text-sm focus-visible:ring-orange-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto justify-end shrink-0">
            <AppButton
              variant={isTrashMode ? "secondary" : "red"}
              onClick={() => setIsTrashMode(!isTrashMode)}
              className="w-full sm:w-auto h-10 text-xs rounded-[1rem]"
              leftIcon={
                isTrashMode ? <ArrowLeft size={16} /> : <Trash2 size={16} />
              }
            >
              {isTrashMode ? "Kembali" : "Hapus"}
            </AppButton>

            {!isTrashMode && (
              <AppButton
                onClick={() => setIsModalOpen(true)}
                variant="default"
                className="w-full sm:w-auto h-10 text-xs rounded-[1rem]"
                leftIcon={<Plus size={16} />}
              >
                Tambah Pengguna
              </AppButton>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 pt-3 border-t border-slate-100 w-full">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 sm:mb-0 sm:mr-2">
            <Filter size={14} /> Filter:
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-9 w-full sm:w-35 rounded-[1rem] border-slate-200 bg-slate-50 font-bold text-xs text-slate-600 focus:ring-orange-500">
              <SelectValue placeholder="Semua Peran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Peran</SelectItem>
              <SelectItem value="siswa">Siswa</SelectItem>
              <SelectItem value="pembina">Pembina</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="h-9 w-full sm:w-45 rounded-[1rem] border-slate-200 bg-slate-50 font-bold text-xs text-slate-600 focus:ring-orange-500">
              <SelectValue placeholder="Semua Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              <SelectItem value="none">Tanpa Kelas / Alumni</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="h-9 w-full sm:w-35 rounded-[1rem] border-slate-200 bg-slate-50 font-bold text-xs text-slate-600 focus:ring-orange-500">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="terbaru">Terbaru</SelectItem>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="za">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AppCard>

      <AppCard noPadding className="border-slate-200 shadow-sm rounded-[1rem]">
        {draftUsers.length > 0 ? (
          <StagingTable
            data={draftUsers}
            onCancel={() => setDraftUsers([])}
            onSuccess={() => setDraftUsers([])}
          />
        ) : (
          <UserTable
            users={processedUsers}
            isTrashMode={isTrashMode}
            classes={classes}
          />
        )}
      </AppCard>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDataExtracted={(data: BulkUserPayload[]) => {
          setDraftUsers(data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
