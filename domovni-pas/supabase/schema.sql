-- BULO — Supabase schéma (v1)
-- Použití: Supabase → SQL Editor → New query → vložit celé → Run.
-- Pozn.: RLS politiky jsou rozumný start, budeme je dolaďovat při stavbě funkcí.

create extension if not exists "pgcrypto";

-- ── Profily uživatelů (klient / architekt) ──────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'client' check (role in ('client','architect')),
  full_name text,
  studio_name text,
  created_at timestamptz not null default now()
);

-- Profil se založí automaticky po registraci (role z metadat, jinak 'client').
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role','client'),
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── Domy (vlastní klient) ───────────────────────────────────────────────────
create table if not exists houses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  type text not null default 'HOUSE',
  street text, city text, zip text,
  cadastral_area text, parcel_number text,
  year_built int,
  description text,
  handed_over boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Členové domu = omezený přístup (architekt jako přispěvatel, sdílení ke čtení).
create table if not exists house_members (
  house_id uuid not null references houses(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'viewer' check (role in ('architect','viewer')),
  created_at timestamptz not null default now(),
  primary key (house_id, profile_id)
);

-- ── Dokumentace (páteř) ─────────────────────────────────────────────────────
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references houses(id) on delete cascade,
  title text not null,
  category text,   -- CONTRACT/PLAN/MODEL/CERTIFICATE/ENERGY_LABEL/INVOICE/OTHER
  section text,    -- POZEMEK/NAVRH/REALIZACE/BUDOVA
  storage_path text not null,
  file_name text,
  mime text,
  size_bytes bigint,
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- ── Systémy domu (solár / elektřina / voda / topení …) ───────────────────────
create table if not exists systems (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references houses(id) on delete cascade,
  kind text not null,            -- solar/electricity/water/heating/ventilation/other
  name text not null,
  specs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ── Média (fotky/videa, as-built; volitelně špendlík v půdorysu) ─────────────
create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references houses(id) on delete cascade,
  system_id uuid references systems(id) on delete set null,
  kind text not null check (kind in ('photo','video')),
  storage_path text not null,
  thumb_path text,
  caption text,
  room text,
  plan_document_id uuid references documents(id) on delete set null,
  plan_x real, plan_y real,      -- pozice špendlíku na půdorysu (0–1), pro "kudy vede"
  taken_at timestamptz,
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- ── Odečty / spotřeby (time-series — připraveno na automatiku z měřičů) ──────
create table if not exists readings (
  id uuid primary key default gen_random_uuid(),
  system_id uuid not null references systems(id) on delete cascade,
  metric text not null,          -- production_kwh/water_m3/electricity_kwh/temperature_c/...
  value numeric not null,
  measured_at timestamptz not null,
  source text not null default 'manual' check (source in ('manual','api')),
  created_at timestamptz not null default now()
);
create index if not exists readings_system_metric_time on readings (system_id, metric, measured_at);

-- ── Záruky a revize ─────────────────────────────────────────────────────────
create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references houses(id) on delete cascade,
  title text not null,
  type text,
  due_date date,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Historie (časová osa) ───────────────────────────────────────────────────
create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references houses(id) on delete cascade,
  type text,
  title text not null,
  description text,
  date date,
  cost numeric,
  created_at timestamptz not null default now()
);

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table profiles      enable row level security;
alter table houses        enable row level security;
alter table house_members enable row level security;
alter table documents     enable row level security;
alter table systems       enable row level security;
alter table media         enable row level security;
alter table readings      enable row level security;
alter table reminders     enable row level security;
alter table entries       enable row level security;

create or replace function has_house_access(h uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from houses where id = h and owner_id = auth.uid())
      or exists (select 1 from house_members where house_id = h and profile_id = auth.uid());
$$;

create or replace function is_house_owner(h uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from houses where id = h and owner_id = auth.uid());
$$;

-- profily
create policy "profiles_self_select" on profiles for select using (id = auth.uid());
create policy "profiles_self_update" on profiles for update using (id = auth.uid());

-- domy
create policy "houses_select" on houses for select using (has_house_access(id));
create policy "houses_insert" on houses for insert with check (owner_id = auth.uid());
create policy "houses_update" on houses for update using (owner_id = auth.uid());
create policy "houses_delete" on houses for delete using (owner_id = auth.uid());

-- členové (spravuje vlastník)
create policy "members_select" on house_members for select using (has_house_access(house_id));
create policy "members_owner_all" on house_members for all
  using (is_house_owner(house_id)) with check (is_house_owner(house_id));

-- podřízené tabulky vázané na house_id
create policy "documents_all" on documents for all
  using (has_house_access(house_id)) with check (has_house_access(house_id));
create policy "systems_all" on systems for all
  using (has_house_access(house_id)) with check (has_house_access(house_id));
create policy "media_all" on media for all
  using (has_house_access(house_id)) with check (has_house_access(house_id));
create policy "reminders_all" on reminders for all
  using (has_house_access(house_id)) with check (has_house_access(house_id));
create policy "entries_all" on entries for all
  using (has_house_access(house_id)) with check (has_house_access(house_id));

-- odečty (přístup přes dům systému)
create policy "readings_all" on readings for all
  using (has_house_access((select house_id from systems s where s.id = system_id)))
  with check (has_house_access((select house_id from systems s where s.id = system_id)));

-- ── Úložiště souborů (buckety + politiky) ────────────────────────────────────
-- Konvence cesty: "<house_id>/<soubor>" — první složka = ID domu.
insert into storage.buckets (id, name, public)
values ('documents','documents',false), ('media','media',false)
on conflict (id) do nothing;

create policy "storage_documents_access" on storage.objects for all to authenticated
  using (bucket_id = 'documents' and has_house_access(((storage.foldername(name))[1])::uuid))
  with check (bucket_id = 'documents' and has_house_access(((storage.foldername(name))[1])::uuid));

create policy "storage_media_access" on storage.objects for all to authenticated
  using (bucket_id = 'media' and has_house_access(((storage.foldername(name))[1])::uuid))
  with check (bucket_id = 'media' and has_house_access(((storage.foldername(name))[1])::uuid));
