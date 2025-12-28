-- 1. Ensure the table exists
create table if not exists community_settings (
  id uuid default gen_random_uuid() primary key,
  contact_name text, -- Added from migration 01
  contact_wechat text,
  contact_phone text,
  group_qr_code text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Add contact_name column if it was missing (for safety)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'community_settings' and column_name = 'contact_name') then
    alter table community_settings add column contact_name text;
  end if;
end $$;

-- 3. Insert default row if empty
insert into community_settings (contact_name, contact_wechat, contact_phone, group_qr_code)
select '管理员', 'TihoAdmin', '13800000000', ''
where not exists (select 1 from community_settings);

-- 4. Enable RLS
alter table community_settings enable row level security;

-- 5. Drop existing policies to reset them
drop policy if exists "Public can view community settings" on community_settings;
drop policy if exists "Admins can update community settings" on community_settings;
drop policy if exists "Admins can insert community settings" on community_settings;
drop policy if exists "Public Access Community Settings Select" on community_settings;
drop policy if exists "Public Access Community Settings Insert" on community_settings;
drop policy if exists "Public Access Community Settings Update" on community_settings;
drop policy if exists "Public Access Community Settings Delete" on community_settings;

-- 6. Create FULL PUBLIC policies as requested
create policy "Public Access Community Settings Select"
  on community_settings for select
  to public
  using (true);

create policy "Public Access Community Settings Insert"
  on community_settings for insert
  to public
  with check (true);

create policy "Public Access Community Settings Update"
  on community_settings for update
  to public
  using (true);

create policy "Public Access Community Settings Delete"
  on community_settings for delete
  to public
  using (true);
