import { z } from "zod";

export const attendanceSchema = z.object({
  profile_id: z.string().uuid("ID Siswa tidak valid"),
  schedule_id: z.number().int("ID Jadwal tidak valid"),
  status: z.enum(["hadir", "terlambat", "izin", "alpa"]).default("hadir"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type AttendanceInput = z.infer<typeof attendanceSchema>;
