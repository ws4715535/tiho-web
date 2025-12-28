-- ==========================================
-- 综合修复脚本：社群配置与存储
-- 请复制以下所有内容到 Supabase SQL Editor 并运行
-- ==========================================

BEGIN;

-- 1. 创建 community_settings 表
create table if not exists public.community_settings (
  id uuid default gen_random_uuid() primary key,
  contact_name text,
  contact_wechat text,
  contact_phone text,
  group_qr_code text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 确保 contact_name 字段存在 (针对旧表结构修复)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'community_settings' and column_name = 'contact_name') then
    alter table public.community_settings add column contact_name text;
  end if;
end $$;

-- 2. 插入默认数据 (如果表为空)
insert into public.community_settings (contact_name, contact_wechat, contact_phone, group_qr_code)
select '管理员', 'TihoAdmin', '13800000000', ''
where not exists (select 1 from public.community_settings);

-- 3. 启用 RLS
alter table public.community_settings enable row level security;

-- 4. 清理旧策略 (防止冲突)
drop policy if exists "Public can view community settings" on public.community_settings;
drop policy if exists "Admins can update community settings" on public.community_settings;
drop policy if exists "Admins can insert community settings" on public.community_settings;
drop policy if exists "Public Access Community Settings Select" on public.community_settings;
drop policy if exists "Public Access Community Settings Insert" on public.community_settings;
drop policy if exists "Public Access Community Settings Update" on public.community_settings;
drop policy if exists "Public Access Community Settings Delete" on public.community_settings;

-- 5. 创建全公开策略 (Table)
create policy "Public Access Community Settings Select"
  on public.community_settings for select
  to public
  using (true);

create policy "Public Access Community Settings Insert"
  on public.community_settings for insert
  to public
  with check (true);

create policy "Public Access Community Settings Update"
  on public.community_settings for update
  to public
  using (true);

create policy "Public Access Community Settings Delete"
  on public.community_settings for delete
  to public
  using (true);

-- 6. 配置 Storage Bucket
insert into storage.buckets (id, name, public)
values ('community_settings', 'community_settings', true)
on conflict (id) do nothing;

-- 7. 清理旧 Storage 策略
drop policy if exists "Public Access Community Settings Read" on storage.objects;
drop policy if exists "Public Access Community Settings Insert" on storage.objects;
drop policy if exists "Public Access Community Settings Update" on storage.objects;
drop policy if exists "Public Access Community Settings Delete" on storage.objects;
-- 同时也清理之前可能错误创建在 qr_manage 上的策略，或者之前的命名
drop policy if exists "Public Access QR" on storage.objects;
drop policy if exists "Admin Upload QR" on storage.objects;
drop policy if exists "Admin Update QR" on storage.objects;
drop policy if exists "Admin Delete QR" on storage.objects;

-- 8. 创建全公开 Storage 策略
create policy "Public Access Community Settings Read"
  on storage.objects for select
  using ( bucket_id = 'community_settings' );

create policy "Public Access Community Settings Insert"
  on storage.objects for insert
  with check ( bucket_id = 'community_settings' );

create policy "Public Access Community Settings Update"
  on storage.objects for update
  using ( bucket_id = 'community_settings' );

create policy "Public Access Community Settings Delete"
  on storage.objects for delete
  using ( bucket_id = 'community_settings' );

COMMIT;

-- 9. 强制刷新 PostgREST Schema Cache
NOTIFY pgrst, 'reload schema';
