# Admin Panel Upgrade

## Fáze 1 — Infrastruktura (DONE)
- [x] `SUPABASE_SERVICE_ROLE_KEY` přidán do `.env.local`
- [x] `src/lib/supabase/admin.ts` — admin Supabase client (service_role)
- [x] `src/lib/auth/verifyAdmin.ts` — JWT verify helper
- [x] Supabase Storage bucket `media` (public reads)
- [x] `next.config.ts` — Supabase hostname pro images

## Fáze 2 — Sjednocení auth na JWT (DONE)
- [x] `middleware.ts` — JWT verify z admin_token cookie (odstraněn Supabase auth)
- [x] `admin/layout.tsx` — JWT verify, ne Supabase user check
- [x] `AdminSidebar.tsx` — logout přes `/api/auth/logout`
- [x] Smazán legacy `admin/login/page.tsx`
- [x] Login page redirect na `/admin` po přihlášení

## Fáze 3 — Footer admin link (DONE)
- [x] Nahrazena opacity-0.08 za text-black/20 (nenápadný ale kliknutelný)

## Fáze 4 — Upload systém (DONE)
- [x] `/api/admin/upload/route.ts` — JWT auth + multipart upload do Supabase Storage
- [x] `/api/admin/upload/delete/route.ts` — smazání ze Storage
- [x] `ImageUpload.tsx` — single image: drag&drop, preview, URL fallback
- [x] `MultiImageUpload.tsx` — multi image: sortable, přidání/odebrání
- [x] `DocImageUpload.tsx` — multi image s alt textem pro dokumentaci

## Fáze 5 — DB změny + doc galerie (DONE)
- [x] TypeScript typy rozšířeny: `doc_images`, `doc_video` v Project
- [x] Migrace SQL soubor: `supabase/migrations/20260305_add_doc_columns.sql`
- [x] Migration API route: `/api/admin/migrate` (pro seed dat po přidání columns)
- [x] Project detail page: data-driven doc galerie (ne hardcoded slug checks)
- [ ] **POZOR**: Potřeba spustit SQL migraci v Supabase Dashboard!

## Fáze 6 — Admin API routes (DONE)
- [x] `/api/admin/projects` — POST + PUT
- [x] `/api/admin/projects/[id]` — DELETE
- [x] `/api/admin/blog` — POST + PUT
- [x] `/api/admin/blog/[id]` — DELETE
- [x] `/api/admin/about` — PUT
- [x] `/api/admin/settings` — PUT

## Fáze 7 — Vylepšení formulářů (DONE)
- [x] `ProjectForm.tsx` — ImageUpload pro thumbnail, MultiImageUpload pro galerii, DocImageUpload pro dokumentaci, input pro doc_video
- [x] `BlogPostForm.tsx` — ImageUpload pro cover image
- [x] Oba formuláře: submit přes API routes (ne přímý Supabase client)

## Fáze 8 — Nové admin stránky (DONE)
- [x] About editor: `/admin/about` + `AboutForm.tsx` (bio, profil, education, languages, experience, workshops)
- [x] Settings editor: `/admin/settings` + `SettingsForm.tsx` (hero title, emails, social links)
- [x] AdminSidebar: přidány "O mně" a "Nastavení"
- [x] Dashboard: quick links na nové sekce

## Fáze 9 — Cleanup (DONE)
- [x] Delete tlačítka na project/blog listing stránkách
- [x] `DeleteButton.tsx` — reusable s confirm dialogem
- [x] Odstraněny Supabase auth importy z admin kódu
- [x] `next build` — OK, žádné chyby

---

## ZBÝVÁ SPUSTIT
1. Spustit SQL migraci v Supabase Dashboard SQL Editor:
   `supabase/migrations/20260305_add_doc_columns.sql`
2. Po přidání columns zavolat `/api/admin/migrate` (POST) pro seed dat
3. Smazat `/api/admin/migrate` route po úspěšné migraci
