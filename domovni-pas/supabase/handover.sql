-- BULO — předání dat (developer / architekt → klient). Spustit v Supabase SQL Editoru PO schema.sql.

-- 1) Nová role: developer (stavební firma)
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check
  check (role in ('client','architect','developer'));

-- 2) Domy: pole pro předání
alter table houses add column if not exists created_by uuid references profiles(id);
alter table houses add column if not exists owner_email text;
-- status: draft = profík pracuje, handed_over = předáno (čeká na převzetí), active = vlastník užívá
alter table houses add column if not exists status text not null default 'active'
  check (status in ('draft','handed_over','active'));

-- backfill u dříve založených domů
update houses set created_by = owner_id where created_by is null;

-- 3) E-mail přihlášeného (pro převzetí podle e-mailu)
create or replace function my_email()
returns text language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

-- 4) Širší přístup k domu: vlastník NEBO tvůrce (profík) NEBO příjemce dle e-mailu NEBO člen
create or replace function has_house_access(h uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from houses x
    where x.id = h
      and ( x.owner_id = auth.uid()
         or x.created_by = auth.uid()
         or (x.owner_email is not null and lower(x.owner_email) = my_email()) )
  )
  or exists (select 1 from house_members m where m.house_id = h and m.profile_id = auth.uid());
$$;

-- 5) Převzetí: příjemce (dle e-mailu) si smí dům přiřadit jako vlastník
drop policy if exists "houses_claim" on houses;
create policy "houses_claim" on houses for update
  using (owner_email is not null and lower(owner_email) = my_email())
  with check (owner_id = auth.uid());

-- Pozn.: houses_select/insert/update/delete a child-tabulky z schema.sql zůstávají;
-- has_house_access je teď širší, takže profík i příjemce vidí dům i jeho dokumenty/fotky.
