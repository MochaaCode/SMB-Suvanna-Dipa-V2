"use client";

import { useState } from "react";
import { UserTable } from "./UserTable";
import { AddUserModal } from "./AddUserModal";
import { StagingTable } from "./StagingTable";
import { AppCard } from "../../shared/AppCard";
import { PageHeader } from "../../shared/PageHeader";
import { AppButton } from "../../shared/AppButton";
import { Input } from "@/components/ui/input";
import { Users, Trash2, Plus, Search, ArrowLeft } from "lucide-react";
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
  const [sortOrder, setSortOrder] = useState("terbaru");

  const baseUsers = isTrashMode
    ? initialUsers.filter((u) => u.is_deleted)
    : initialUsers.filter((u) => !u.is_deleted);

  let processedUsers = [...baseUsers];
  if (searchQuery) {
    processedUsers = processedUsers.filter((u) =>
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  if (sortOrder === "az") {
    processedUsers.sort((a, b) =>
      (a.full_name || "").localeCompare(b.full_name || ""),
    );
  } else if (sortOrder === "za") {
    processedUsers.sort((a, b) =>
      (b.full_name || "").localeCompare(a.full_name || ""),
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <PageHeader
        title={isTrashMode ? "TEMPAT" : "DAFTAR"}
        highlightText={isTrashMode ? "SAMPAH" : "PENGGUNA"}
        subtitle={
          isTrashMode
            ? "Data pengguna terhapus sementara"
            : "Kelola database Siswa, Pembina, & Admin"
        }
        icon={isTrashMode ? <Trash2 size={24} /> : <Users size={24} />}
        themeColor={isTrashMode ? "red" : "orange"}
      />

      <AppCard className="p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto text-left">
          <div className="relative w-full md:w-72">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <Input
              placeholder="Cari nama pengguna..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-10 rounded-lg border-slate-200 bg-slate-50 font-medium text-sm focus-visible:ring-orange-500 transition-all shadow-sm"
            />
          </div>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="h-10 w-full md:w-40 rounded-lg border-slate-200 bg-slate-50 font-bold text-xs text-slate-600 shadow-sm focus:ring-orange-500">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="terbaru">Terbaru</SelectItem>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="za">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <AppButton
            variant={isTrashMode ? "secondary" : "red"}
            onClick={() => setIsTrashMode(!isTrashMode)}
            className="h-10 text-xs"
            leftIcon={
              isTrashMode ? <ArrowLeft size={16} /> : <Trash2 size={16} />
            }
          >
            {isTrashMode ? "Kembali" : "Tempat Sampah"}
          </AppButton>

          {!isTrashMode && (
            <AppButton
              onClick={() => setIsModalOpen(true)}
              variant="default"
              className="h-10 text-xs"
              leftIcon={<Plus size={16} />}
            >
              Tambah Pengguna
            </AppButton>
          )}
        </div>
      </AppCard>

      <AppCard noPadding className="border-slate-200 shadow-sm">
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
