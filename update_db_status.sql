-- 请复制以下 SQL 代码并在 Supabase Dashboard 的 SQL Editor 中运行
-- 地址：https://supabase.com/dashboard/project/_/sql

ALTER TABLE paired_teams 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
