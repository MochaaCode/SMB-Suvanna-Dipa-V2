"use client";

import { AppModal } from "../../shared/AppModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  Calendar,
  GraduationCap,
  User,
  Phone,
  Baby,
  School,
  Heart,
  Star,
  Mail,
} from "lucide-react";

import type { ProfileWithEmailAndClass } from "@/app/(admin)/admin/users/page";

interface UserDetailModalProps {
  user: ProfileWithEmailAndClass | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
}: UserDetailModalProps) {
  if (!user) return null;

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Profil Pengguna"
      variant="orange"
      maxWidth="xl"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left mb-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-5">
        <Avatar className="h-20 w-20 border border-slate-200 shadow-sm shrink-0">
          <AvatarImage src={user.avatar_url || ""} />
          <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-2xl">
            {user.full_name?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-3 flex-1">
          <div>
            <h2 className="text-xl font-bold text-slate-800 leading-tight">
              {user.full_name || "Tanpa Nama"}
            </h2>
            {user.buddhist_name && (
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                &quot;{user.buddhist_name}&quot;
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <Badge
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-none ${
                user.role === "admin"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : user.role === "pembina"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-green-50 text-green-700 border-green-200"
              }`}
            >
              {user.role}
            </Badge>
            <Badge className="bg-orange-50 text-orange-700 border-orange-200 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-none">
              <Star size={10} fill="currentColor" /> {user.points} Poin
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pribadi" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-lg mb-4">
          <TabsTrigger
            value="pribadi"
            className="text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
          >
            Pribadi
          </TabsTrigger>
          <TabsTrigger
            value="akademik"
            className="text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
          >
            Akademik
          </TabsTrigger>
          <TabsTrigger
            value="kontak"
            className="text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all"
          >
            Kontak
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-56 pr-3">
          <TabsContent value="pribadi" className="outline-none m-0">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4 shadow-sm text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={12} className="text-slate-400" /> Gender
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {user.gender || "-"}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={12} className="text-slate-400" /> Kelahiran
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {user.birth_place || ""}{" "}
                    {user.birth_date ? `- ${user.birth_date}` : "-"}
                  </p>
                </div>
              </div>
              <div className="h-px bg-slate-100 w-full" />
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Heart size={12} className="text-slate-400" /> Hobi
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {user.hobby || "-"}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="akademik" className="outline-none m-0">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4 shadow-sm text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail size={12} className="text-slate-400" /> Email Login
                  </p>
                  <p className="text-sm font-semibold text-slate-700 truncate">
                    {user.email}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <School size={12} className="text-slate-400" /> Asal Sekolah
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {user.school_name || "-"}
                  </p>
                </div>
              </div>
              <div className="h-px bg-slate-100 w-full" />
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap size={12} className="text-slate-400" />{" "}
                  Penempatan Kelas
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {user.classes?.name || "Tidak ada kelas / Alumni"}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="kontak" className="outline-none m-0">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4 shadow-sm text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone size={12} className="text-slate-400" /> WA Personal
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {user.phone_number || "-"}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Baby size={12} className="text-slate-400" /> Nama Wali
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {user.parent_name || "-"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone size={12} className="text-slate-400" /> WA Wali
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {user.parent_phone_number || "-"}
                  </p>
                </div>
              </div>
              <div className="h-px bg-slate-100 w-full" />
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Home size={12} className="text-slate-400" /> Alamat Lengkap
                </p>
                <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                  {user.address || "-"}
                </p>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </AppModal>
  );
}
