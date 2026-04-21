import { z } from "zod";

export const profileUpdateSchema = z.object({
  full_name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  buddhist_name: z.string().optional().nullable(),
  gender: z.enum(["Laki-Laki", "Perempuan"]).optional(),
  birth_place: z.string().optional().nullable(),
  birth_date: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phone_number: z
    .string()
    .min(10, "Nomor HP minimal 10 digit")
    .optional()
    .nullable(),
  parent_name: z.string().optional().nullable(),
  school_name: z.string().optional().nullable(),
  hobby: z.string().optional().nullable(),
  image_url: z
    .string()
    .url("Format link foto salah")
    .optional()
    .nullable()
    .or(z.literal("")),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
