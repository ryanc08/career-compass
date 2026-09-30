-- TalentDeck candidates table. Run once Lovable Cloud / database is connected.
create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  location text not null,
  bio text not null,
  readiness_score int not null default 0 check (readiness_score between 0 and 100),
  is_vetted boolean not null default false,
  available_jobs text[] not null default '{}',
  experience_summary text,
  certifications text[] not null default '{}',
  avatar_url text,
  resume_url text,
  created_at timestamptz not null default now()
);

grant select on public.candidates to anon, authenticated;
grant insert on public.candidates to authenticated;
grant all on public.candidates to service_role;

alter table public.candidates enable row level security;
create policy "Public can read candidates" on public.candidates for select using (true);
create policy "Signed-in users can create candidates" on public.candidates for insert to authenticated with check (true);

create index candidates_available_jobs_idx on public.candidates using gin (available_jobs);
