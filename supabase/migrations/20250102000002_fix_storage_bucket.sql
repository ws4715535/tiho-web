-- Create storage bucket for community_settings if it doesn't exist
insert into storage.buckets (id, name, public)
values ('community_settings', 'community_settings', true)
on conflict (id) do nothing;

-- Set up RLS policies for storage to allow PUBLIC access for EVERYTHING
-- (As requested: public read, public upload/modify/delete)

-- Public Read
create policy "Public Access Community Settings Read"
  on storage.objects for select
  using ( bucket_id = 'community_settings' );

-- Public Insert (Upload)
create policy "Public Access Community Settings Insert"
  on storage.objects for insert
  with check ( bucket_id = 'community_settings' );

-- Public Update
create policy "Public Access Community Settings Update"
  on storage.objects for update
  using ( bucket_id = 'community_settings' );

-- Public Delete
create policy "Public Access Community Settings Delete"
  on storage.objects for delete
  using ( bucket_id = 'community_settings' );
