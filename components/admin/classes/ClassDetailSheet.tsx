/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransition, useState, useMemo } from "react";
import { updateClassStaff, promoteStudentsBulk } from "@/actions/admin/classes";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  UserCheck,
  GraduationCap,
  Search,
  Star,
  X,
  MoveRight,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { AppButton } from "../../shared/AppButton";

import type { ClassWithDetails } from "@/actions/admin/classes";
import type { Profile } from "@/types";

interface ClassDetailSheetProps {
  cls: ClassWithDetails;
  allPembina: Pick<Profile, "id" | "full_name" | "avatar_url">[];
  allClasses: ClassWithDetails[];
}

interface ConfirmMoveState {
  isOpen: boolean;
  data: {
    studentId: string;
    studentName: string | null;
    targetClassId: number;
    targetName: string;
  } | null;
}

export function ClassDetailSheet({
  cls,
  allPembina,
  allClasses,
}: ClassDetailSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [confirmMove, setConfirmMove] = useState<ConfirmMoveState>({
    isOpen: false,
    data: null,
  });

  const [selectedTeacher, setSelectedTeacher] = useState(cls.teacher_id || "");
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>(
    cls.assistant_ids || [],
  );

  const filteredStudents = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const cutoffDate = new Date(currentYear, 6, 1);

    return (
      cls.students
        ?.filter((s) =>
          s.full_name
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()),
        )
        .map((s) => {
          if (!s.birth_date) {
            return { ...s, ageAtCutoff: 0, isDueForPromotion: false };
          }
          const birth = new Date(s.birth_date);
          let ageAtCutoff = currentYear - birth.getFullYear();
          if (
            new Date(currentYear, birth.getMonth(), birth.getDate()) >
            cutoffDate
          ) {
            ageAtCutoff--;
          }
          return {
            ...s,
            ageAtCutoff,
            isDueForPromotion:
              cls.max_age !== null && ageAtCutoff > cls.max_age,
          };
        }) || []
    );
  }, [cls.students, debouncedSearchTerm, cls.max_age]);

  const executeMove = () => {
    if (!confirmMove.data) return;
    const { studentId, studentName, targetClassId, targetName } =
      confirmMove.data;

    startTransition(async () => {
      try {
        await promoteStudentsBulk([
          {
            studentId,
            name: studentName,
            currentClassId: cls.id,
            targetClassId,
            targetClassName: targetName,
            age: 0,
          },
        ]);
        toast.success(`Berhasil dipindahkan ke kelas baru.`, { icon: "✅" });
        setConfirmMove({ isOpen: false, data: null });
      } catch (error: any) {
        toast.error(`Gagal memindahkan: ${error.message}`);
      }
    });
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateClassStaff(
          cls.id,
          selectedTeacher || null,
          selectedAssistants,
        );
        toast.success(`Data staf pengajar diperbarui.`);
      } catch (error: any) {
        toast.error(`Gagal menyimpan: ${error.message}`);
      }
    });
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <AppButton
            variant="orange"
            className="w-full h-10 font-bold rounded-[1rem] text-xs"
          >
            Kelola Detail Kelas
          </AppButton>
        </SheetTrigger>

        <SheetContent className="sm:max-w-lg p-0 flex flex-col h-full bg-white border-none shadow-xl">
          <SheetHeader className="p-6 bg-slate-900 text-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-slate-800 rounded-[1rem] border border-slate-700">
                <GraduationCap size={24} className="text-orange-500" />
              </div>
              <div className="text-left">
                <SheetTitle className="text-xl font-bold text-white leading-none">
                  Kelas {cls.name}
                </SheetTitle>
                <p className="text-slate-400 text-[11px] font-semibold tracking-wider mt-1.5 uppercase">
                  Total: {cls.students?.length || 0} Siswa Terdaftar
                </p>
              </div>
            </div>
          </SheetHeader>

          <Tabs defaultValue="murid" className="flex-1 flex flex-col min-h-0">
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 shrink-0">
              <TabsList className="grid w-full grid-cols-2 bg-slate-200/50 p-1 rounded-[1rem]">
                <TabsTrigger
                  value="murid"
                  className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm rounded-[0.8rem] transition-all"
                >
                  Daftar Siswa
                </TabsTrigger>
                <TabsTrigger
                  value="pengajar"
                  className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm rounded-[0.8rem] transition-all"
                >
                  Staf Pengajar
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="murid"
              className="flex-1 flex flex-col min-h-0 m-0 p-0 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 bg-white shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Cari nama siswa..."
                    className="pl-9 h-10 rounded-[1rem] border-slate-200 bg-slate-50 font-medium text-sm focus-visible:ring-slate-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <ScrollArea className="flex-1 h-full bg-slate-50/30">
                <div className="p-6 space-y-3 pb-10">
                  {filteredStudents.length === 0 ? (
                    <p className="text-center text-xs font-medium text-slate-400 mt-10">
                      Siswa tidak ditemukan.
                    </p>
                  ) : (
                    filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className="p-4 rounded-[1rem] bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all text-left"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0">
                              {student.full_name?.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 leading-tight mb-1">
                                {student.full_name}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                  Usia: {student.ageAtCutoff} Tahun
                                </span>
                                {student.isDueForPromotion && (
                                  <Badge className="bg-red-50 text-red-600 text-[9px] font-bold uppercase px-2 py-0 border-red-200">
                                    Promosi
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="bg-orange-50 border border-orange-100 px-2.5 py-1.5 rounded-lg text-center min-w-12.5">
                            <p className="text-[8px] font-bold text-orange-500 uppercase leading-none mb-0.5">
                              Poin
                            </p>
                            <div className="flex items-center justify-center gap-1 text-xs font-bold text-orange-700">
                              <Star size={10} fill="currentColor" />{" "}
                              {student.points || 0}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1.5 tracking-wider">
                            <MoveRight size={12} /> Mutasi Ke:
                          </span>
                          <div className="flex flex-wrap gap-1.5 justify-end">
                            {allClasses
                              .filter((c) => c.id !== cls.id)
                              .map((target) => (
                                <button
                                  key={target.id}
                                  onClick={() =>
                                    setConfirmMove({
                                      isOpen: true,
                                      data: {
                                        studentId: student.id,
                                        studentName: student.full_name,
                                        targetClassId: target.id,
                                        targetName: target.name,
                                      },
                                    })
                                  }
                                  className="px-2.5 py-1 rounded-[1rem] bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-colors"
                                >
                                  {target.name}
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent
              value="pengajar"
              className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50/30"
            >
              <div className="space-y-2.5 text-left">
                <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <UserCheck size={14} className="text-orange-500" /> Pengajar
                  Utama
                </label>
                <select
                  className="w-full h-11 px-3 rounded-[1rem] border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:border-slate-400 outline-none cursor-pointer shadow-sm"
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                >
                  <option value="">-- Pilih Guru Utama --</option>
                  {allPembina.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2.5 text-left">
                <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Users size={14} className="text-orange-500" /> Group Leaders
                  (Asisten)
                </label>
                <div className="flex flex-wrap gap-2 min-h-11 p-2.5 bg-white rounded-[1rem] border border-slate-200 shadow-sm">
                  {selectedAssistants.length === 0 && (
                    <span className="text-xs text-slate-400 italic flex items-center px-2">
                      Belum ada asisten.
                    </span>
                  )}
                  {selectedAssistants.map((id) => {
                    const asisten = allPembina.find((p) => p.id === id);
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-md font-semibold text-[11px]"
                      >
                        {asisten?.full_name}
                        <X
                          size={14}
                          className="cursor-pointer text-slate-400 hover:text-red-500 transition-colors ml-1"
                          onClick={() =>
                            setSelectedAssistants(
                              selectedAssistants.filter((a) => a !== id),
                            )
                          }
                        />
                      </div>
                    );
                  })}
                </div>
                <select
                  className="w-full h-11 px-3 rounded-[1rem] border border-slate-200 bg-white text-xs font-medium text-slate-500 focus:border-slate-400 outline-none cursor-pointer shadow-sm mt-2"
                  onChange={(e) => {
                    if (e.target.value) {
                      setSelectedAssistants([
                        ...selectedAssistants,
                        e.target.value,
                      ]);
                    }
                    e.target.value = "";
                  }}
                  value=""
                >
                  <option value="">+ Tambah Asisten Baru</option>
                  {allPembina
                    .filter(
                      (p) =>
                        !selectedAssistants.includes(p.id) &&
                        p.id !== selectedTeacher,
                    )
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name}
                      </option>
                    ))}
                </select>
              </div>
            </TabsContent>
          </Tabs>

          <SheetFooter className="p-6 bg-white border-t border-slate-100 shrink-0">
            <AppButton
              onClick={handleSave}
              isLoading={isPending}
              className="w-full h-11 text-sm font-bold rounded-[1rem] shadow-sm"
              leftIcon={<CheckCircle2 size={18} />}
            >
              Simpan Perubahan
            </AppButton>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={confirmMove.isOpen}
        onOpenChange={(io) =>
          !io && setConfirmMove({ isOpen: false, data: null })
        }
      >
        <AlertDialogContent className="rounded-[1rem] border border-slate-200 shadow-xl p-6 sm:p-8 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-800">
              Konfirmasi Mutasi Kelas
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-slate-600 mt-2 leading-relaxed">
              Anda akan memindahkan siswa bernama{" "}
              <span className="font-bold text-slate-900">
                {confirmMove.data?.studentName}
              </span>{" "}
              ke kelas{" "}
              <span className="font-bold text-orange-600">
                {confirmMove.data?.targetName}
              </span>
              . Lanjutkan proses ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-[1rem] font-bold text-xs h-10 border-slate-200 text-slate-600 hover:bg-slate-50">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeMove}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-[1rem] font-bold text-xs h-10 shadow-sm"
            >
              Ya, Pindahkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
