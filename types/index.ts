// types/index.ts

// ==========================================
// 1. LITERAL TYPES
// ==========================================
export type Gender = "Laki-Laki" | "Perempuan";
export type UserRole = "siswa" | "pembina" | "admin";
export type AttendanceStatus = "hadir" | "terlambat" | "izin" | "alpa";
export type AttendanceMethod = "rfid" | "manual";
export type OrderStatus = "pending" | "diproses" | "selesai" | "dibatalkan";
export type PointHistoryType = "earning" | "spending";
export type CardStatus = "tersedia" | "terpakai" | "hilang";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ==========================================
// 2. CORE DATABASE TABLES
// ==========================================

export interface Profile {
  id: string; // uuid
  full_name: string | null;
  buddhist_name: string | null;
  gender: Gender | null;
  birth_place: string | null;
  birth_date: string | null; // Format YYYY-MM-DD
  address: string | null;
  phone_number: string | null;
  parent_name: string | null;
  school_name: string | null;
  hobby: string | null;
  points: number; // Default 0
  role: UserRole; // Default 'siswa'
  class_id: number | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  avatar_url: string | null;
  parent_phone_number: string | null;
}

export interface AttendanceLog {
  id: number;
  profile_id: string | null;
  schedule_id: number | null;
  rfid_uid: string | null;
  status: AttendanceStatus;
  method: AttendanceMethod;
  recorded_by: string | null;
  scan_time: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface ProductOrder {
  id: number;
  user_id: string | null;
  product_id: number | null;
  total_points: number;
  status: OrderStatus;
  processed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PointHistory {
  id: number;
  user_id: string | null;
  amount: number;
  description: string;
  order_id: number | null;
  given_by: string | null;
  created_at: string;
  updated_at: string;
  type: PointHistoryType | null;
}

export interface PasswordResetToken {
  id: string; // uuid
  user_id: string | null;
  email: string;
  token: string;
  expires_at: string;
  is_used: boolean;
  created_at: string;
  profiles?: Partial<Profile> | null;
}

export interface DailyVisitorStat {
  id: number;
  date: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface PageView {
  id: number;
  page_path: string;
  page_name: string | null;
  visitor_id: string | null;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
}

export interface Class {
  id: number;
  name: string;
  teacher_id: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  assistant_ids: string[];
  min_age: number | null;
  max_age: number | null;
}

export interface Schedule {
  id: number;
  title: string;
  content: string | null;
  event_date: string;
  class_id: number | null;
  is_active: boolean;
  is_announcement: boolean;
  is_deleted: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface RfidCard {
  uid: string;
  status: CardStatus;
  profile_id: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeviceState {
  id: string;
  mode: string;
  updated_at: string;
}

export interface PublicContent {
  id: number;
  section: string;
  title: string;
  content: Json;
  images: string[] | null;
  is_published: boolean;
  display_order: number;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

// ==========================================
// 3. COMPOSITE TYPES (Relasi / Join)
// ==========================================

export interface AttendanceLogWithProfile extends AttendanceLog {
  profiles?: Partial<Profile> | null;
  classes?: Partial<Class> | null;
}

export interface ProductOrderWithRelations extends ProductOrder {
  profiles?: Partial<Profile> | null;
  products?: Partial<Product> | null;
}

export interface PointHistoryWithProfile extends PointHistory {
  profiles?: Partial<Profile> | null;
}

export interface YearlyRecapData {
  "Nama Lengkap": string;
  Kelas: string;
  "Total Poin": number;
  "Total Hadir": number;
  "Total Terlambat": number;
  "Total Izin/Sakit": number;
  "Total Alpa": number;
  "Status Keaktifan": string;
}
