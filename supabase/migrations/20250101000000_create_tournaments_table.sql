-- Create tournaments table
create table if not exists public.tournaments (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subtitle text,
  type text check (type in ('team', 'individual')),
  status text default 'active' check (status in ('active', 'archived', 'upcoming')),
  banner_url text,
  banner_gradient_from text,
  banner_gradient_to text,
  intro text,
  full_intro text,
  match_time_desc text,
  rules_desc text,
  rewards_desc text,
  sort_order int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.tournaments enable row level security;

-- Create policies (allow read for everyone, write for authenticated users/service role)
-- For simplicity in this demo, assuming anon key has read access
create policy "Public tournaments are viewable by everyone"
  on public.tournaments for select
  using (true);

create policy "Users can insert their own tournaments"
  on public.tournaments for insert
  with check (true); -- In prod, check auth.role() = 'authenticated'

create policy "Users can update their own tournaments"
  on public.tournaments for update
  using (true);

create policy "Users can delete their own tournaments"
  on public.tournaments for delete
  using (true);
