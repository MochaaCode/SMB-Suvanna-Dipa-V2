1. Audit Struktur Tabel & Kolom

SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
ORDER BY 
    table_name, ordinal_position;

2. Audit Relasi & Constraints (Kunci Utama & Foreign Key) 

SELECT
    tc.table_schema, 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema = 'public';

3. Audit Check Constraints (Validasi Role & Gender)

SELECT 
    conname AS constraint_name, 
    conrelid::regclass AS table_name, 
    pg_get_constraintdef(oid) AS definition
FROM 
    pg_constraint
WHERE 
    contype = 'c' 
    AND connamespace = 'public'::regnamespace;

4. Audit Row Level Security (RLS) Policies

SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual AS using_expression, 
    with_check
FROM 
    pg_policies
WHERE 
    schemaname = 'public';

5. Audit Triggers & Functions 

-- Cek Triggers
SELECT 
    event_object_table AS table_name, 
    trigger_name, 
    event_manipulation AS event, 
    action_statement AS definition, 
    action_timing AS timing
FROM 
    information_schema.triggers
WHERE 
    trigger_schema = 'public';

-- Cek Source Code Function (Logika di balik Trigger)
SELECT 
    p.proname AS function_name, 
    pg_get_functiondef(p.oid) AS definition
FROM 
    pg_proc p
JOIN 
    pg_namespace n ON p.pronamespace = n.oid
WHERE 
    n.nspname = 'public';

6. Audit Storage (Buckets & Konfigurasi)

-- Cek Daftar Bucket & Aturannya
SELECT 
    id AS bucket_id, 
    name, 
    public AS is_public, 
    file_size_limit, 
    allowed_mime_types 
FROM 
    storage.buckets;

-- Cek Ringkasan Isi File di Tiap Bucket
SELECT 
    bucket_id, 
    COUNT(id) AS total_files, 
    SUM(size) / 1024 / 1024 AS total_size_mb 
FROM 
    storage.objects 
GROUP BY 
    bucket_id;

7. Audit Konfigurasi Realtime

SELECT 
    pubname AS publication_name, 
    schemaname AS schema_name, 
    tablename AS table_name 
FROM 
    pg_publication_tables 
WHERE 
    pubname = 'supabase_realtime';

8. Audit Check Constraints (Lebih Rinci)

SELECT 
    conrelid::regclass AS table_name, 
    conname AS constraint_name, 
    CASE contype 
        WHEN 'c' THEN 'CHECK'
        WHEN 'f' THEN 'FOREIGN KEY'
        WHEN 'p' THEN 'PRIMARY KEY'
        WHEN 'u' THEN 'UNIQUE'
    END AS constraint_type,
    pg_get_constraintdef(oid) AS logic_definition
FROM 
    pg_constraint
WHERE 
    connamespace = 'public'::regnamespace
    AND contype = 'c' -- Hanya ambil Check Constraint
ORDER BY 
    table_name;

