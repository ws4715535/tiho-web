create table if not exists paired_teams (
  id uuid default gen_random_uuid() primary key,
  team_name text not null,
  avatar_url text,
  description text,
  member_1_name text not null,
  member_2_name text not null,
  total_score numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table paired_teams enable row level security;

-- Public Read
create policy "Public Access Paired Teams Select"
  on paired_teams for select
  to public
  using (true);

-- Public Insert/Update/Delete (for now, to avoid auth issues during dev/admin usage if not strictly authenticated)
-- Ideally should be authenticated only, but user asked for public previously for other tables.
-- I'll keep it public for ease of use as per previous pattern, or authenticated if user is admin.
-- Given previous context "权限暂时都给public", I will set to public.

create policy "Public Access Paired Teams Insert"
  on paired_teams for insert
  to public
  with check (true);

create policy "Public Access Paired Teams Update"
  on paired_teams for update
  to public
  using (true);

create policy "Public Access Paired Teams Delete"
  on paired_teams for delete
  to public
  using (true);
