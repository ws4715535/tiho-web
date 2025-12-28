-- Add contact_name column to community_settings
alter table community_settings 
add column if not exists contact_name text;

-- Create storage bucket for QR codes if it doesn't exist
insert into storage.buckets (id, name, public)
values ('qr_manage', 'qr_manage', true)
on conflict (id) do nothing;

-- Set up RLS policies for storage
-- Public can view files in qr_manage
create policy "Public Access QR"
  on storage.objects for select
  using ( bucket_id = 'qr_manage' );

-- Authenticated users (admins) can upload/update/delete
create policy "Admin Upload QR"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'qr_manage' );

create policy "Admin Update QR"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'qr_manage' );

create policy "Admin Delete QR"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'qr_manage' );
