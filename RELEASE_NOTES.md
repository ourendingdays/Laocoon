# v1.0.0 — Launch

> *The Flame & The Scroll.*

Laocoon is live. A private, cross-platform journaling app for daily writing and long-term self-reflection — built in the open, deployed to the web, and named for the Trojan priest who saw clearly when no one else would listen.

**Try it →** https://laocoon-omega.vercel.app.
> comming soon: https://laocoon.app

---

## What's in v1.0.0

### Writing
- Daily entry surface with an optional title and a lined free-form field.
- Journal history — every entry you've written, editable in place, deletable individually.
- Calendar view with entries badged on the day; tap any day to open a modal with each entry timestamped.
- **"On this day"** — a retrospective view showing what you wrote on the same day across previous years.

### Personalisation
- Full **Dark / Light / System** theme swap, live. System follows the OS.
- **Font size** (Small / Default / Large) applied across every screen via a text wrapper.
- **Default day view** — pick whether the Calendar tab opens on the grid or on "On this day".
- Preferences persist per device (localStorage on web, AsyncStorage on native).

### Auth & account
- Email + password sign-up with a real Privacy Policy consent checkbox (not pre-checked).
- **Forgot password** flow — reset link by email, dedicated screen to set a new one.
- Sign out and delete-my-account from Profile. Deletion is user-scoped and RLS-enforced.

### Privacy & data
- Row-level security in Postgres — you can only ever read or write your own rows.
- **EU-hosted data** (Supabase, Frankfurt).
- One-click **Export my data (JSON)** on the web.
- No trackers, no analytics cookies, no third-party embeds.
- Semver-versioned Privacy Policy with a human-readable effective date.

### Cross-platform
- One codebase ships to iOS, Android, and the web via Expo + `react-native-web`.
- Vercel-hosted web build with SPA rewrites so deep links resolve on hard refresh.

---

## Under the hood

React Native · Expo Router · TypeScript · Supabase (Auth + Postgres + RLS) · Vercel · Custom design system in `styles/theme.ts` + `themeLight.ts`.

Full architecture: [`docs/laocoon-spec.md`](docs/laocoon-spec.md).
DB schema (idempotent): [`docs/db/supabase-setup.sql`](docs/db/supabase-setup.sql).

---

*Your thoughts. Your timeline. Your truth.*

— Pavlo Mospan, 2026
