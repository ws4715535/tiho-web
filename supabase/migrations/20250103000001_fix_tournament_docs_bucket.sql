-- ==========================================
-- 修复脚本：Tournament Docs 存储桶
-- 请复制以下所有内容到 Supabase SQL Editor 并运行
-- ==========================================

BEGIN;

-- 1. 确保 tournament_docs Bucket 存在
insert into storage.buckets (id, name, public)
values ('tournament_docs', 'tournament_docs', true)
on conflict (id) do nothing;

-- 2. 清理旧策略 (防止冲突)
drop policy if exists "Public Access Tournament Docs Read" on storage.objects;
drop policy if exists "Admin Access Tournament Docs Insert" on storage.objects;
drop policy if exists "Admin Access Tournament Docs Update" on storage.objects;
drop policy if exists "Admin Access Tournament Docs Delete" on storage.objects;

-- 3. 创建全公开策略 (方便调试和使用，生产环境可收紧写权限)
-- Public Read
create policy "Public Access Tournament Docs Read"
  on storage.objects for select
  using ( bucket_id = 'tournament_docs' );

-- Public Insert (Upload) - 暂时全公开，解决权限问题
create policy "Public Access Tournament Docs Insert"
  on storage.objects for insert
  with check ( bucket_id = 'tournament_docs' );

-- Public Update
create policy "Public Access Tournament Docs Update"
  on storage.objects for update
  using ( bucket_id = 'tournament_docs' );

-- Public Delete
create policy "Public Access Tournament Docs Delete"
  on storage.objects for delete
  using ( bucket_id = 'tournament_docs' );

COMMIT;

NOTIFY pgrst, 'reload schema';
