-- Trénink cockpit — schéma pro Supabase.
-- Spusť jednou v Supabase → SQL Editor (nebo přes migraci).

-- Aktivity (data z Garminu). Píše je Claude přes service-role klíč (scripts/ingest.mjs).
create table if not exists public.cockpit_activities (
  id                text primary key,          -- Garmin activityId
  date              date not null,
  type              text,
  name              text,
  distance_km       numeric,
  duration_s        integer,
  pace_s_per_km     numeric,
  avg_hr            integer,
  max_hr            integer,
  vo2max            numeric,
  training_effect   numeric,
  elevation_gain_m  numeric,
  calories          integer,
  raw               jsonb,                      -- surová odpověď z Garminu (pro jistotu)
  created_at        timestamptz not null default now()
);

create index if not exists cockpit_activities_date_idx
  on public.cockpit_activities (date desc);

-- Náš sdílený deník (obousměrně: user i claude).
create table if not exists public.cockpit_journal (
  id          uuid primary key default gen_random_uuid(),
  author      text not null check (author in ('user','claude')),
  kind        text not null default 'note' check (kind in ('note','analysis','plan','question')),
  body        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists cockpit_journal_created_idx
  on public.cockpit_journal (created_at desc);

-- Realtime (aby se appka sama obnovila, když Claude něco vloží).
alter publication supabase_realtime add table public.cockpit_activities;
alter publication supabase_realtime add table public.cockpit_journal;

-- ---- RLS -------------------------------------------------------------------
-- POZOR: anon klíč je veřejný (je v NEXT_PUBLIC_). Tyto politiky pouští kohokoli
-- s adresou appky číst data a přidávat záznamy do deníku. Pro osobní hobby appku
-- to obvykle stačí; pro ostrý provoz přidej přihlášení (magic link jako v Mařeně).

alter table public.cockpit_activities enable row level security;
alter table public.cockpit_journal enable row level security;

-- Aktivity: kdokoli (anon) smí číst; zápis jen service-role (bypassuje RLS).
drop policy if exists cockpit_activities_read on public.cockpit_activities;
create policy cockpit_activities_read
  on public.cockpit_activities for select
  using (true);

-- Deník: číst i přidávat smí anon (ty i Claude). Mazání/úpravy jen service-role.
drop policy if exists cockpit_journal_read on public.cockpit_journal;
create policy cockpit_journal_read
  on public.cockpit_journal for select
  using (true);

drop policy if exists cockpit_journal_insert on public.cockpit_journal;
create policy cockpit_journal_insert
  on public.cockpit_journal for insert
  with check (true);
