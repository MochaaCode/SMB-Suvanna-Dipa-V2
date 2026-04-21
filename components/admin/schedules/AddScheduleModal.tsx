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

// IMPORT TIPE KETAT
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
  const [formData, setFormData] = useState({
    title: "",
    event_date: "",
    class_id: "null",
    is_announcement: false,
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Tulis materi atau pengumuman di sini...</p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm focus:outline-none max-w-none p-4 min-h-[160px] max-h-[300px] overflow-y-auto bg-white rounded-b-lg border border-slate-200 border-t-0",
      },
    },
  });

  // Sinkronisasi Form jika mode Edit
  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        if (initialData) {
          setFormData({
            title: initialData.title || "",
            event_date: initialData.event_date
              ? new Date(initialData.event_date).toISOString().split("T")[0]
              : "",
            class_id: initialData.class_id?.toString() || "null",
            is_announcement: initialData.is_announcement || false,
          });
          // @ts-expect-error Penyesuaian tipe JSONB
          editor?.commands.setContent(initialData.content?.html || "<p></p>");
        } else {
          setFormData({
            title: "",
            event_date: "",
            class_id: "null",
            is_announcement: false,
          });
          editor?.commands.setContent(
            "<p>Tulis materi atau pengumuman di sini...</p>",
          );
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, initialData, editor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;
    const htmlContent = editor.getHTML();

    startTransition(async () => {
      try {
        await upsertSchedule({
          id: initialData?.id,
          ...formData,
          class_id:
            formData.class_id === "null" ? null : parseInt(formData.class_id),
          // @ts-expect-error Supabase JSONB cast
          content: { html: htmlContent },
        });
        toast.success(
          initialData ? "Jadwal diperbarui!" : "Jadwal berhasil dibuat!",
        );
        onClose();
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Agenda & Materi" : "Buat Agenda Baru"}
      description="Isi form di bawah untuk menjadwalkan kegiatan pembelajaran."
      variant="orange"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2 text-left">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Judul Kegiatan
          </Label>
          <Input
            required
            placeholder="Contoh: Belajar Sejarah Buddha"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="h-11 font-medium rounded-lg border-slate-200 focus-visible:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tanggal Acara
            </Label>
            <Input
              type="date"
              required
              value={formData.event_date}
              onChange={(e) =>
                setFormData({ ...formData, event_date: e.target.value })
              }
              className="h-11 rounded-lg border-slate-200 font-medium"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Untuk Kelas
            </Label>
            <Select
              value={formData.class_id}
              onValueChange={(v) => setFormData({ ...formData, class_id: v })}
            >
              <SelectTrigger className="h-11 rounded-lg border-slate-200 font-medium text-sm focus:ring-orange-500">
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">Semua Kelas / Umum</SelectItem>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 text-left border-t border-slate-200 pt-5 mt-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Materi Pembelajaran / Isi Pengumuman
          </Label>

          {/* TIPTAP TOOLBAR */}
          <div className="flex gap-1 p-2 bg-slate-50 border border-slate-200 rounded-t-lg border-b-0">
            <AppButton
              type="button"
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 rounded-md ${editor?.isActive("bold") ? "bg-slate-200 text-slate-900" : "text-slate-500"}`}
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              <Bold size={14} />
            </AppButton>
            <AppButton
              type="button"
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 rounded-md ${editor?.isActive("italic") ? "bg-slate-200 text-slate-900" : "text-slate-500"}`}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            >
              <Italic size={14} />
            </AppButton>
            <AppButton
              type="button"
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 rounded-md ${editor?.isActive("bulletList") ? "bg-slate-200 text-slate-900" : "text-slate-500"}`}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
              <List size={14} />
            </AppButton>
          </div>

          {/* TIPTAP CONTENT */}
          {editor ? (
            <EditorContent editor={editor} />
          ) : (
            <div className="h-40 bg-slate-50 animate-pulse border border-slate-200 rounded-b-lg" />
          )}
        </div>

        {/* TOMBOL SUBMIT */}
        <div className="pt-4 border-t border-slate-200 mt-4 flex justify-end">
          <AppButton
            type="submit"
            isLoading={isPending}
            className="w-full md:w-auto h-11"
            leftIcon={<Save size={16} />}
          >
            {initialData ? "Simpan Perubahan" : "Simpan & Publikasikan"}
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
}
