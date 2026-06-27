# Přihlášení e-mailem (Supabase magic link)

Mařena umí dvě přihlášení a **přepínají se samy podle proměnných prostředí**:

- **Bez Supabase klíčů** → jede původní způsob: společné heslo do zázemí + zadání jména.
- **Se Supabase klíči** → přihlášení **e-mailem (magic link)**: zadáš e-mail, přijde odkaz,
  klikneš a jsi uvnitř. Bez hesla. Random člověk se nepřihlásí — pustí jen e-maily na seznamu.

Když klíče nepřidáš (nebo je odebereš), nic se nerozbije — appka jede po starém.

## Co nastavit (jednorázově)

### 1) Založ Supabase projekt
1. [supabase.com](https://supabase.com) → **New project** (zapamatuj si heslo k DB, ale to sem nepotřebuješ).
2. Levé menu **Authentication → Providers → Email** — nech zapnuté (magic link je v Emailu).
3. **Authentication → URL Configuration**:
   - **Site URL**: `https://marena-blush.vercel.app` (tvoje produkční adresa)
   - **Redirect URLs**: přidej `https://marena-blush.vercel.app/auth/callback`
     (a pro lokální testování i `http://localhost:3000/auth/callback`)

### 2) Zkopíruj klíče
**Project Settings → API**:
- **Project URL** → půjde do `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → půjde do `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3) Přidej proměnné do Vercelu
Vercel → projekt **Mařena** → **Settings → Environment Variables** (Production), přidej:

| Název | Hodnota |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL ze Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key ze Supabase |
| `MARENA_ALLOWED_EMAILS` | e-maily, co smí dovnitř hned (čárkami) — hlavně **tvůj** |

Příklad `MARENA_ALLOWED_EMAILS`:
```
kristianvys@gmail.com, dalsi@organizator.cz
```

Pak **Redeploy** (nebo spusť „Deploy Mařena to Vercel" v GitHub Actions).

## Kdo se dostane dovnitř (allowlist)

Po ověření e-mailu se pustí dovnitř, jen když je e-mail:
- v **`MARENA_ALLOWED_EMAILS`** (na rozjezd a pro správce), **nebo**
- u některého **člena týmu** (e-mail, který má zapsaný v sekci **Tým**).

Takže nového člověka přidáš tak, že mu **v Týmu zapíšeš e-mail** — pak se přihlásí magic linkem.
Kdo na seznamu není, dostane hlášku „požádej správce" a dovnitř ho to nepustí.

## Jak to pak funguje pro lidi

1. Otevřou Mařenu → **Vstup do zázemí** → zadají e-mail (registrace navíc jméno).
2. Přijde jim e-mail s odkazem → kliknou → jsou v zázemí. Jméno se vezme z jejich účtu/člena.
3. Odhlášení je normálně přes **Odhlásit**.

> Pozn.: Supabase má na free tieru limit odeslaných e-mailů. Pro malý tým bohatě stačí;
> kdyby bylo potřeba víc, jde nastavit vlastní SMTP v Supabase (Authentication → Emails).
