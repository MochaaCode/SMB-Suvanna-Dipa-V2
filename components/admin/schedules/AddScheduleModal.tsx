/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { AppModal } from "../../shared/AppModal";
import { AppButton } from "../../shared/AppButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { upsertSchedule } from "@/actions/admin/schedules";
import { Bold, Italic, List, Save } from "lucide-react";
import toast from "react-hot-toast";

import type { ScheduleWithRelations } from "@/actions/admin/schedules";
import type { Class } from "@/types";

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: Class[];
  initialData?: ScheduleWithRelations | null;
}

export function AddScheduleModal({
  isOpen,
  onClose,
  classes = [],
  initialData,
}: AddScheduleModalProps) {
  const [isPending, startTransition] = useTransition();

  const defaultFormData = {
    title: "",
    event_date: "",
    start_time: "09:20",
    end_time: "11:00",
    class_id: "none",
    is_announcement: false,
    content: "",
  };

  const [formData, setFormData] = useState(defaultFormData);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);

    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title,
          event_date: initialData.event_date.split("T")[0],
          start_time: initialData.start_time || "09:00",
          end_time: initialData.end_time || "11:00",
          class_id: initialData.class_id?.toString() || "none",
          is_announcement: initialData.is_announcement,
          content: initialData.content ? (initialData.content as string) : "",
        });
      } else {
        setFormData(defaultFormData);
      }
    }
  }

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[150px] px-4 py-3 bg-white rounded-b-[1rem]",
      },
    },
  });

  useEffect(() => {
    if (isOpen && editor) {
      editor.commands.setContent(
        initialData?.content ? (initialData.content as string) : "",
      );
    }
  }, [isOpen, initialData, editor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const tid = toast.loading("Menyimpan jadwal...");
      try {
        const payload = {
          ...formData,
          class_id:
            formData.class_id === "none" ? null : parseInt(formData.class_id),
          content: editor?.getHTML(),
        };
        await upsertSchedule(payload, initialData?.id);
        toast.success("Jadwal berhasil disimpan!", { id: tid });
        onClose();
      } catch (error: any) {
        toast.error(error.message, { id: tid });
      }
    });
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        initialData ? "Edit Jadwal / Pengumuman" : "Buat Jadwal / Pengumuman"
      }
      variant="orange"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-left mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Judul / Topik
            </Label>
            <Input
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Contoh: Riwayat Sang Buddha..."
              className="h-11 rounded-[1rem] border-slate-200 bg-slate-50 font-medium focus-visible:ring-orange-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kategori
            </Label>
            <Select
              value={formData.is_announcement ? "true" : "false"}
              onValueChange={(val) =>
                setFormData({ ...formData, is_announcement: val === "true" })
              }
            >
              <SelectTrigger className="h-11 rounded-[1rem] border-slate-200 bg-slate-50 font-semibold focus:ring-orange-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Materi / Jadwal Belajar</SelectItem>
                <SelectItem value="true">Pengumuman Terbuka</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tanggal
            </Label>
            <Input
              type="date"
              required
              value={formData.event_date}
              onChange={(e) =>
                setFormData({ ...formData, event_date: e.target.value })
              }
              className="h-11 rounded-[1rem] border-slate-200 bg-slate-50 font-medium focus-visible:ring-orange-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Mulai (WIB)
            </Label>
            <Input
              type="time"
              required
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
              className="h-11 rounded-[1rem] border-slate-200 bg-slate-50 font-medium focus-visible:ring-orange-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Selesai (WIB)
            </Label>
            <Input
              type="time"
              required
              value={formData.end_time}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
              className="h-11 rounded-[1rem] border-slate-200 bg-slate-50 font-medium focus-visible:ring-orange-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Target Kelas
          </Label>
          <Select
            value={formData.class_id}
            onValueChange={(val) => setFormData({ ...formData, class_id: val })}
          >
            <SelectTrigger className="h-11 rounded-[1rem] border-slate-200 bg-slate-50 font-semibold focus:ring-orange-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Semua Kelas (Umum)</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  Kelas {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Isi Materi / Deskripsi
          </Label>
          <div className="border border-slate-200 rounded-[1rem] overflow-hidden shadow-sm">
            <div className="bg-slate-100 border-b border-slate-200 p-2 flex items-center gap-1">
              <AppButton
                type="button"
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 rounded-[0.8rem] ${editor?.isActive("bold") ? "bg-slate-200 text-slate-900" : "text-slate-500"}`}
                onClick={() => editor?.chain().focus().toggleBold().run()}
              >
                <Bold size={14} />
              </AppButton>
              <AppButton
                type="button"
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 rounded-[0.8rem] ${editor?.isActive("italic") ? "bg-slate-200 text-slate-900" : "text-slate-500"}`}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              >
                <Italic size={14} />
              </AppButton>
              <AppButton
                type="button"
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 rounded-[0.8rem] ${editor?.isActive("bulletList") ? "bg-slate-200 text-slate-900" : "text-slate-500"}`}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
              >
                <List size={14} />
              </AppButton>
            </div>
            {editor ? (
              <EditorContent editor={editor} />
            ) : (
              <div className="h-40 bg-slate-50 animate-pulse border-t border-slate-200 rounded-b-[1rem]" />
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 mt-6 flex justify-end">
          <AppButton
            type="submit"
            isLoading={isPending}
            className="h-11 px-8 rounded-[1rem] font-bold"
            leftIcon={<Save size={18} />}
          >
            {initialData ? "Simpan Perubahan" : "Publikasikan Jadwal"}
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
}
