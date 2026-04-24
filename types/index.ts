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

export interface Profile {
  id: string;
  full_name: string | null;
  buddhist_name: string | null;
  gender: Gender | null;
  birth_place: string | null;
  birth_date: string | null;
  address: string | null;
  phone_number: string | null;
  parent_name: string | null;
  parent_phone_number: string | null;
  school_name: string | null;
  hobby: string | null;
  role: UserRole;
  points: number;
  class_id: number | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  avatar_url: string;
}

export interface Class {
  id: number;
  name: string;
  min_age: number;
  max_age: number;
  teacher_id: string | null;
  assistant_ids: string[] | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: number;
  title: string;
  class_id: number;
  date: string;
  start_time: string;
  end_time: string;
  type: string;
  description: string | null;
  speaker_id: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
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
  is_deleted: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductOrder {
  id: number;
  user_id: string | null;
  product_id: number | null;
  total_points: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface PointHistory {
  id: number;
  user_id: string | null;
  amount: number;
  type: PointHistoryType;
  description: string;
  order_id: number | null;
  created_at: string;
}

export interface PublicContent {
  id: number;
  section: string;
  title: string;
  content: string;
  images: string[];
  display_order: number;
  is_published: boolean;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface PasswordResetToken {
  id: number;
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
  unique_visitors: number;
  page_views: Json;
}

export interface SystemLog {
  id: number;
  action: string;
  entity_type: string;
  entity_id: string | null;
  user_id: string | null;
  details: Json;
  created_at: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  user_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface ContentDraft {
  id: number;
  title: string;
  content: Json;
  status: string;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeneralSetting {
  id: number;
  key: string;
  value: Json;
  description: string | null;
  updated_by: string | null;
  updated_at: string;
}

export interface EventRegistration {
  id: number;
  event_id: number | null;
  user_id: string | null;
  status: string;
  registered_at: string;
}

export interface AcademicRecord {
  id: number;
  user_id: string | null;
  class_id: number | null;
  semester: string;
  grade: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: number;
  user_id: string | null;
  category: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: string;
  created_by: string | null;
  expires_at: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentTag {
  id: number;
  name: string;
  slug: string;
}

export interface ContentTagMap {
  content_id: number;
  tag_id: number;
}

export interface MediaLibrary {
  id: number;
  file_name: string;
  file_url: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: string | null;
  created_at: string;
}

export interface ForumCategory {
  id: number;
  name: string;
  description: string | null;
  display_order: number;
  is_deleted: boolean;
}

export interface ForumTopic {
  id: number;
  category_id: number | null;
  title: string;
  content: string;
  author_id: string | null;
  is_pinned: boolean;
  is_locked: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ForumPost {
  id: number;
  topic_id: number | null;
  content: string;
  author_id: string | null;
  reply_to_id: number | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: number;
  user_id: string | null;
  achievement_id: number | null;
  earned_at: string;
}

export interface AchievementBadge {
  id: number;
  name: string;
  description: string;
  icon_url: string | null;
  criteria: Json;
  created_at: string;
}

export interface ReportLog {
  id: number;
  report_type: string;
  generated_by: string | null;
  parameters: Json;
  file_url: string | null;
  created_at: string;
}

export interface Bookmark {
  id: number;
  user_id: string | null;
  content_type: string;
  content_id: number;
  created_at: string;
}

export interface ScheduledTask {
  id: number;
  task_name: string;
  schedule_cron: string;
  last_run_at: string | null;
  next_run_at: string | null;
  status: string;
  is_active: boolean;
}

export interface ApiKey {
  id: number;
  key_hash: string;
  name: string;
  scopes: string[];
  created_by: string | null;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

export interface AuditTrail {
  id: number;
  table_name: string;
  record_id: string;
  action: string;
  old_data: Json;
  new_data: Json;
  changed_by: string | null;
  changed_at: string;
}

export interface InteractiveModule {
  id: number;
  title: string;
  type: string;
  config: Json;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModuleProgress {
  id: number;
  module_id: number | null;
  user_id: string | null;
  progress_data: Json;
  completed_at: string | null;
  updated_at: string;
}

export interface MessageTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  created_at: string;
  updated_at: string;
}

export interface DonationCampaign {
  id: number;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DonationRecord {
  id: number;
  campaign_id: number | null;
  donor_name: string | null;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

export interface Vendor {
  id: number;
  name: string;
  contact_info: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  location: string | null;
  vendor_id: number | null;
  last_restocked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: number;
  user_id: string | null;
  subject: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketReply {
  id: number;
  ticket_id: number | null;
  user_id: string | null;
  message: string;
  is_internal: boolean;
  created_at: string;
}

export interface Survey {
  id: number;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SurveyQuestion {
  id: number;
  survey_id: number | null;
  question_text: string;
  question_type: string;
  options: Json;
  display_order: number;
}

export interface SurveyResponse {
  id: number;
  survey_id: number | null;
  user_id: string | null;
  answers: Json;
  submitted_at: string;
}

export interface SystemAlert {
  id: number;
  level: string;
  message: string;
  is_resolved: boolean;
  resolved_by: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface BackupLog {
  id: number;
  file_name: string;
  size_bytes: number;
  status: string;
  created_at: string;
  completed_at: string | null;
}

export interface FeatureToggle {
  id: number;
  feature_key: string;
  is_enabled: boolean;
  description: string | null;
  updated_by: string | null;
  updated_at: string;
}

export interface CustomFieldDef {
  id: number;
  entity_type: string;
  field_name: string;
  field_type: string;
  is_required: boolean;
  display_order: number;
}

export interface CustomFieldValue {
  id: number;
  entity_id: string;
  field_def_id: number | null;
  field_value: Json;
}

export interface TranslationKey {
  id: number;
  lang_code: string;
  key_name: string;
  translation_value: string;
  updated_at: string;
}

export interface CachedQuery {
  id: number;
  query_hash: string;
  result_data: Json;
  expires_at: string;
  created_at: string;
}

export interface TempImportData {
  id: number;
  session_id: string;
  raw_data: Json;
  validation_errors: Json;
  is_processed: boolean;
  created_at: string;
}

export interface ThemeConfig {
  id: number;
  theme_name: string;
  colors: Json;
  fonts: Json;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PluginRegistry {
  id: number;
  plugin_name: string;
  version: string;
  is_enabled: boolean;
  config: Json;
  installed_at: string;
  updated_at: string;
}

export interface WorkflowDef {
  id: number;
  name: string;
  trigger_event: string;
  steps: Json;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowInstance {
  id: number;
  workflow_def_id: number | null;
  target_entity_id: string;
  current_step: string;
  status: string;
  context_data: Json;
  started_at: string;
  updated_at: string;
}

export interface ApiRateLimit {
  id: number;
  endpoint: string;
  limit_count: number;
  window_seconds: number;
  is_active: boolean;
}

export interface WebhookEndpoint {
  id: number;
  url: string;
  events: string[];
  secret_key: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentTemplate {
  id: number;
  name: string;
  content_html: string;
  variables: Json;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SyncLog {
  id: number;
  source_system: string;
  target_system: string;
  status: string;
  records_processed: number;
  errors: Json;
  started_at: string;
  completed_at: string | null;
}

export interface MaintenanceWindow {
  id: number;
  start_time: string;
  end_time: string;
  reason: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ArchiveRule {
  id: number;
  table_name: string;
  condition_sql: string;
  retention_days: number;
  is_active: boolean;
}

export interface SessionLog {
  id: number;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  login_at: string;
  logout_at: string | null;
}

export interface UserPreference {
  id: number;
  user_id: string | null;
  theme: string;
  notifications: Json;
  dashboard_layout: Json;
  updated_at: string;
}

export interface MetricSnapshot {
  id: number;
  metric_name: string;
  metric_value: number;
  dimensions: Json;
  captured_at: string;
}

export interface ExternalIntegration {
  id: number;
  provider_name: string;
  credentials: Json;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReportSubscription {
  id: number;
  report_id: number | null;
  user_id: string | null;
  frequency: string;
  format: string;
  is_active: boolean;
}

export interface DataExportQueue {
  id: number;
  user_id: string | null;
  query_params: Json;
  status: string;
  file_url: string | null;
  requested_at: string;
  completed_at: string | null;
}

export interface SecurityPolicy {
  id: number;
  role: string;
  resource: string;
  action: string;
  effect: string;
  conditions: Json;
}

export interface ContentRevision {
  id: number;
  content_id: number | null;
  revision_data: Json;
  created_by: string | null;
  created_at: string;
}

export interface BannerCampaign {
  id: number;
  title: string;
  image_url: string;
  target_url: string | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

export interface FAQCategory {
  id: number;
  name: string;
  display_order: number;
  is_active: boolean;
}

export interface FAQItem {
  id: number;
  category_id: number | null;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

export interface GalleryAlbum {
  id: number;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  created_at: string;
}

export interface GalleryImage {
  id: number;
  album_id: number | null;
  image_url: string;
  caption: string | null;
  display_order: number;
  uploaded_at: string;
}

export interface Sponsor {
  id: number;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: string;
  is_active: boolean;
}

export interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  is_active: boolean;
  posted_at: string;
  expires_at: string | null;
}

export interface JobApplication {
  id: number;
  job_id: number | null;
  applicant_name: string;
  email: string;
  phone: string | null;
  resume_url: string | null;
  status: string;
  applied_at: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  status: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export interface Testimonial {
  id: number;
  user_name: string;
  role_or_title: string | null;
  content: string;
  rating: number;
  is_published: boolean;
  created_at: string;
}

export interface PartnerInstitution {
  id: number;
  name: string;
  type: string;
  contact_person: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ResourceLink {
  id: number;
  title: string;
  url: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface GlossaryTerm {
  id: number;
  term: string;
  definition: string;
  category: string | null;
}

export interface VersionHistory {
  id: number;
  version_number: string;
  release_date: string;
  release_notes: string;
  is_major: boolean;
}

export interface AttendanceLogWithProfile extends AttendanceLog {
  profiles?: Partial<Profile> | null;
  classes?: Partial<Class> | null;
  created_at: string;
}

export interface ProductOrderWithRelations extends ProductOrder {
  profiles?: Partial<Profile> | null;
  products?: Partial<Product> | null;
}

export interface PointHistoryWithProfile extends PointHistory {
  profiles?: Partial<Profile> | null;
}

export interface PasswordResetTokenWithProfile extends PasswordResetToken {
  profiles?: Partial<Profile> | null;
}
