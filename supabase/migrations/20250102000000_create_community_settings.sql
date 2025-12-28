create table community_settings (
  id uuid default gen_random_uuid() primary key,
  contact_wechat text, -- 联系人微信号
  contact_phone text, -- 联系人电话
  group_qr_code text, -- 群二维码图片URL
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert a default row if not exists
insert into community_settings (contact_wechat, contact_phone, group_qr_code)
select 'TihoAdmin', '13800000000', ''
where not exists (select 1 from community_settings);

-- RLS
alter table community_settings enable row level security;

create policy "Public can view community settings"
  on community_settings for select
  to public
  using (true);

create policy "Admins can update community settings"
  on community_settings for update
  to authenticated
  using (true)
  with check (true);

create policy "Admins can insert community settings"
  on community_settings for insert
  to authenticated
  with check (true);
