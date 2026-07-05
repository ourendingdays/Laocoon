# Laocoon — Setup Tutorial

Everything you need to get Laocoon running from scratch: local dev, Supabase backend, and Vercel deployment behind a custom domain.

---

## Prerequisites

- **Node.js** ≥ 20 (`node -v`)
- **npm** (bundled with Node)
- **Git** (`git --version`)
- A **Supabase** account (free tier is fine)
- A **Vercel** account (free tier is fine)
- A **GitHub** account to host the repo
- A registered **domain** if you want a custom URL (optional; the `*.vercel.app` URL always works)

---

## Part 1 — Local dev

### 1.1 Clone and install

```bash
git clone <your-repo-url> laocoon
cd laocoon
npm install
```

### 1.2 Create the Supabase project

1. Sign in at https://supabase.com → **New project**.
2. Pick a region close to your users. For GDPR, choose an EU region (e.g. `eu-central-1` Frankfurt or `eu-west-3` Paris).
3. Set a strong DB password (write it down; you won't need it for the app but you'll need it if you ever manage the DB manually).
4. Wait 2–3 minutes for provisioning.

### 1.3 Run the schema setup

1. In the Supabase dashboard → **SQL Editor** → **New query**.
2. Open `docs/db/supabase-setup.sql` from this repo. Copy its full contents.
3. Paste and click **Run**. This creates, in order:
   - `entries` table (with `if not exists`, so re-running is safe)
   - RLS policies on `entries` (SELECT / INSERT / UPDATE / DELETE, all gated by `auth.uid() = user_id`)
   - `set_updated_at()` trigger function + triggers on both tables
   - `user_profiles` table (GDPR consent tracking + deletion flag)
   - RLS policies on `user_profiles`
   - `handle_new_user()` trigger that auto-creates a `user_profiles` row when someone signs up
   - Backfill for any existing `auth.users` who don't yet have a profile row
4. The script is fully idempotent — safe to re-run any time to reconcile drift.

Everything you need is in this one file.

### 1.4 Get your Supabase credentials

Supabase dashboard → **Project Settings → API**:

- **Project URL** → copy (looks like `https://xxxxx.supabase.co`)
- **anon / publishable key** → copy (this is safe to expose in client code)

**Never use the `service_role` key in the client.** It bypasses RLS.

### 1.5 Configure `.env`

Create `.env` at the repo root:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
```

The `EXPO_PUBLIC_` prefix makes them available to Expo's client bundle. Verify `.env` is in `.gitignore` — it is by default in this repo. Never commit it.

### 1.6 Auth settings for development

Supabase dashboard → **Authentication → Providers → Email**:

- **Confirm email**: OFF for dev, ON for production. With it OFF, sign-ups can log in immediately without clicking a confirmation link.

Supabase dashboard → **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:8081` (Expo web default port)
- **Redirect URLs**: add `http://localhost:8081/update-password` so the password reset flow can redirect back to your local instance.

### 1.7 Start the dev server

```bash
npx expo start
```

Then pick a target:
- **Web**: press `w` or run `npx expo start --web`. Opens at http://localhost:8081.
- **iOS Simulator**: press `i` (macOS + Xcode required).
- **Android Emulator**: press `a` (Android Studio required).
- **Physical device**: install Expo Go, scan the QR code.

### 1.8 Smoke test

- Sign up at `/sign-in` → "Create one" link.
- Check that a row appears in Supabase → **Authentication → Users**.
- Create an entry from Home. Verify it appears in `entries` in the Supabase Table Editor.
- Toggle theme in Settings → Dark / Light / System. Preference persists across reloads.

---

## Part 2 — Production deployment on Vercel

### 2.1 Push the repo to GitHub

```bash
git remote add origin git@github.com:<your-user>/laocoon.git
git push -u origin main
```

### 2.2 Verify build config

These files must exist at the repo root:

- **`vercel.json`** — tells Vercel how to build:
  ```json
  {
    "buildCommand": "npm run build:web",
    "outputDirectory": "dist",
    "framework": null,
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
  The `rewrites` line makes client-side routing work on hard refresh — without it, `laocoon.app/settings` would 404.

- **`package.json`** must include the build script:
  ```json
  "build:web": "expo export --platform web"
  ```

Test locally:
```bash
npm run build:web
```
Should produce a `dist/` folder with an `index.html` and per-route static files.

### 2.3 Create the Vercel project

1. Sign in at https://vercel.com with GitHub.
2. **Add New → Project** → import your `laocoon` repo.
3. Framework preset: **Other** (Vercel reads `vercel.json`).
4. Root directory: leave blank.
5. Build & Output: leave blank (from `vercel.json`).
6. **Environment Variables** — add both, checked for **Production**, **Preview**, and **Development**:
   - `EXPO_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = your Supabase anon key
7. Click **Deploy**. First build takes 2–3 minutes.
8. Vercel gives you a `laocoon-<hash>.vercel.app` URL. Open it — this is your live production site. Smoke test everything.

### 2.4 Attach a custom domain

Say your domain is `example.com`.

1. Vercel → **Project → Settings → Domains → Add**. Enter `example.com`. Then add `www.example.com`.

**Option A — Hand DNS to Vercel (simplest):**

- At your registrar (Namecheap, Cloudflare, etc.), change the domain's nameservers to Vercel's:
  ```
  ns1.vercel-dns.com
  ns2.vercel-dns.com
  ```
- Save. Propagation takes 15 min to a few hours (occasionally up to 48).
- Check with: `dig NS example.com +short` — when it shows the Vercel nameservers, you're done.
- Or use https://www.whatsmydns.net (record type `NS`).

**Option B — Keep registrar DNS, add records manually:**

- Add an **A record**: Host `@`, Value `76.76.21.21`, TTL Automatic.
- Add a **CNAME record**: Host `www`, Value `cname.vercel-dns.com`, TTL Automatic.
- Delete any conflicting `@` or `www` records (default parking page ones).

2. Back in Vercel Domains, click **Refresh** next to each entry once propagation completes. Both flip from Invalid → Valid.
3. HTTPS certificates are auto-issued via Let's Encrypt within a few minutes of validation. Green padlock = done.

### 2.5 Point Supabase at production

Supabase dashboard → **Authentication → URL Configuration**:

- **Site URL**: `https://example.com`
- **Redirect URLs**: add all three:
  - `https://example.com`
  - `https://example.com/sign-in`
  - `https://example.com/update-password`

Supabase dashboard → **Authentication → Providers → Email**:

- Flip **Confirm email** to **ON** for production. New users now need to click a confirmation link before signing in.

### 2.6 Production smoke test

- Sign up with a fresh email → confirmation email arrives with a `https://example.com/...` link → click through → sign in.
- Create an entry. Verify it appears on Journal and Calendar.
- Toggle Dark / Light / System. Refresh browser. Preference sticks.
- Hard-load a deep link, e.g. `https://example.com/settings`. Should render Settings (not 404). If it 404s, `vercel.json` didn't ship — check the deployment output on Vercel.
- Test forgot-password: sign-in page → "Forgot password?" → enter email → check inbox → click link → set new password → sign in with it.
- Test delete-account on a throwaway user → confirm entries disappear from Supabase for that user only, other users untouched.

---

## Part 3 — Ongoing operation

### Automatic deploys

Every push to `main` triggers a production deploy. Every PR gets a preview deployment at its own URL. If you want to gate production behind manual approval, Vercel → **Settings → Git**.

### Rolling back a broken deploy

Vercel → **Deployments** → find the last known-good deployment → **⋮ → Promote to Production**. Instant.

### Environment variable changes

Vercel dashboard → **Settings → Environment Variables**. After editing, **redeploy** — running deployments don't pick up new env vars until you retrigger a build.

### Bumping the Privacy Policy

If you change legal text in `app/privacy.tsx`:

1. Update `PRIVACY_POLICY_VERSION` and `PRIVACY_POLICY_EFFECTIVE_DATE` in `lib/legal.ts`.
2. Existing users won't be re-prompted for consent automatically — that would need a check on load comparing their stored version to the current one, and a modal to accept the new version. Not implemented yet.

### Updating the Supabase schema

Any schema change: edit `docs/db/supabase-setup.sql`, run the delta in the Supabase SQL Editor, commit the change so the file stays in sync with what's actually deployed.

### Backups

Supabase → **Database → Backups**. Free tier includes daily automated backups with a 7-day retention. Paid tiers extend retention.

### Costs to watch

- **Supabase**: free tier includes 500 MB DB, 2 GB egress, 50 MAU auth. Journals are tiny (text), so DB and egress are unlikely to hit limits unless the user base grows past several hundred active users.
- **Vercel**: free (Hobby) tier includes 100 GB bandwidth, unlimited deploys. Non-commercial personal projects fit here.
- **Domain**: $10–$30/year at Namecheap depending on TLD.

---

## Troubleshooting

**"Invalid Configuration" stays on the custom domain in Vercel** — DNS hasn't propagated. Wait, then click Refresh. Verify with `dig NS <domain> +short`.

**Deep links 404 in production** — `vercel.json` rewrites rule is missing. Redeploy after adding the `rewrites` block.

**Sign-in works locally but fails in production** — check that Supabase `Site URL` and `Redirect URLs` include the production domain, and that both env vars are set in Vercel for Production.

**Reset password link opens the wrong URL** — make sure `/update-password` is in Supabase Redirect URLs.

**Build fails on Vercel with a module error** — usually a missing dependency. Verify `package-lock.json` is committed, then run `rm -rf node_modules && npm install` locally to reproduce.

**Type errors on `npx tsc --noEmit`** — the project's source of truth for types. Fix these before pushing.
