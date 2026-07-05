# Laocoon — Architecture & Implementation Spec

Living reference for the shipped state of the app. Update this document whenever the architecture or data model changes so it doesn't drift from reality.

## Overview

A cross-platform personal journaling app targeting EU users. One React Native codebase serves iOS, Android, and web. Users are stored in Supabase Auth; entries live in a Postgres table protected by row-level security. The web build is deployed to Vercel behind a custom domain (`laocoon.app`). Data is hosted in an EU region to satisfy GDPR.

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | Expo SDK 54 (React Native + React Native Web) | One codebase for iOS, Android, and web |
| Router | `expo-router` v6 | File-based routing, typed routes enabled |
| Backend / Auth / DB | Supabase (free tier) | EU region for GDPR |
| Local storage | AsyncStorage on native, `window.localStorage` on web | Platform adapter in `lib/supabase.ts` and `lib/preferences.tsx` |
| Web hosting | Vercel (free tier) | Auto-deploys from GitHub `main`; `vercel.json` at repo root |
| Domain | Namecheap → Vercel nameservers | Namecheap holds registration only; DNS is delegated to Vercel |
| Language | TypeScript strict mode | `tsc --noEmit` must pass for merges |

## Architecture

```
   ┌────────────────────────────────────────────────────┐
   │                Expo App                            │
   │  (iOS / Android / Web bundle via react-native-web) │
   └────────────────────────┬───────────────────────────┘
                            │
                @supabase/supabase-js
                            │
   ┌────────────────────────▼───────────────────────────┐
   │                    Supabase                        │
   │   Auth (email + password, recovery, sessions)      │
   │   Postgres  (entries, user_profiles)               │
   │   Row-level security (auth.uid() = owner)          │
   │   Triggers (updated_at, handle_new_user)           │
   └────────────────────────────────────────────────────┘
```

Web: Expo exports a static bundle to `dist/` via `npm run build:web` (`expo export --platform web`). Vercel serves `dist/`, with an SPA fallback rewrite (`/(.*) → /index.html`) in `vercel.json` so hard-loaded deep links resolve.

## Client architecture

### Routing

File-based, all under `app/`. Route groups (parens in folder names) don't appear in URLs.

```
app/
  _layout.tsx           ← root Stack + AuthGate
  welcome.tsx           ← unauthenticated landing (public)
  privacy.tsx           ← Privacy Policy page (public)
  update-password.tsx   ← post–reset-email password change (public)
  settings.tsx          ← Settings, pushed on top of tabs
  about.tsx             ← About page, pushed on top of tabs
  (auth)/
    _layout.tsx         ← Stack, themed header
    sign-in.tsx
    sign-up.tsx
    reset.tsx           ← "Forgot password?" form
  (tabs)/
    _layout.tsx         ← Tabs (Home, Calendar, Journal, Profile)
    index.tsx           ← Home / write entry
    calendar.tsx        ← Calendar + "On this day"
    journal.tsx         ← List / edit / delete entries
    profile.tsx         ← Avatar + stats + nav to Settings/About/Privacy + Export + Delete + Sign out
```

### AuthGate

`app/_layout.tsx` wraps the tree in `<PreferencesProvider>` → `<SessionProvider>` → `<AuthGate>` → root `<Stack>`. The gate has three cases:

- Public routes (`welcome`, `privacy`, `update-password`, or any `(auth)/*`): pass through regardless of session.
- No session + non-public: redirect to `/welcome`.
- Session + inside `(auth)` group or on `welcome`: redirect to `/(tabs)`.

Pushed pages (`settings`, `about`, `privacy`) are registered on the root Stack with a themed header (bronze pitch background, marble text) and `headerBackTitle: 'Back'` so iOS doesn't show `(tabs)`.

### Theme system

- `styles/theme.ts` — dark palette + shared types (`Theme`, `ThemeMode`) + `useTheme()` hook + `getCardSource()` helper.
- `styles/themeLight.ts` — light palette bundle (same shape as dark).
- `useTheme()` reads `preferences.theme`. If `'system'`, defers to `useColorScheme()` from React Native.
- Screens build styles via `useMemo(() => makeStyles(theme), [theme])`. Card `ImageBackground` sources come from `getCardSource(name, theme.mode)` with light-variant assets in `assets/cards-light/`.

### Preferences

`lib/preferences.tsx` — React context, platform storage adapter (`localStorage` / `AsyncStorage`), single JSON key `laocoon:preferences`. Fields:

- `theme: 'dark' | 'light' | 'system'`
- `fontSize: 'small' | 'default' | 'large'`
- `defaultDayView: 'onthisday' | 'calendar'`

`components/AppText.tsx` is a `forwardRef` wrapper around React Native's `Text`. It multiplies `fontSize` (and `lineHeight`, if numeric) by the current scale factor from preferences. Screens import it as `import { AppText as Text } from '../../components/AppText'` so no JSX changes were needed to enable font-size scaling.

### Icons

All icons are custom SVGs in `assets/icons/index.tsx`, using `react-native-svg`. `{ size, color }` API. See `CLAUDE.md` for the current inventory.

## Database schema

Source of truth: **`docs/db/supabase-setup.sql`** — idempotent, safe to re-run against any project. Run it against a fresh Supabase project to create everything from scratch, or against your live project to reconcile drift.

### `entries`

| Column | Type | Notes |
|---|---|---|
| `entry_id` | uuid (PK) | `default gen_random_uuid()` |
| `user_id` | uuid (FK → auth.users) | `on delete cascade`, not null |
| `title` | text | optional |
| `content` | text | not null |
| `created_at` | timestamptz | `default now()` |
| `updated_at` | timestamptz | bumped by the `set_updated_at` trigger |
| `emotion` | text | placeholder for future emotion tagging |

### `user_profiles`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK, FK → auth.users) | `on delete cascade` |
| `consent_given_at` | timestamptz | populated on signup via consent metadata |
| `privacy_policy_version` | text | semver, matches `PRIVACY_POLICY_VERSION` in `lib/legal.ts` |
| `deletion_requested_at` | timestamptz | set by "Delete my account" flow |
| `created_at`, `updated_at` | timestamptz | `default now()` |

### Triggers

- **`set_updated_at`** on `entries` and `user_profiles` — a `before update` trigger that sets `new.updated_at = now()`. Client code doesn't need to send `updated_at`.
- **`handle_new_user`** on `auth.users` (after insert) — auto-provisions a `user_profiles` row so signup never leaves a user without a profile. `security definer` so it works regardless of the session that triggered it.

### Row-level security

Enabled on both tables. Policies:

| Table | Operation | Rule |
|---|---|---|
| `entries` | SELECT | `using (auth.uid() = user_id)` |
| `entries` | INSERT | `with check (auth.uid() = user_id)` |
| `entries` | UPDATE | `using` + `with check` on `auth.uid() = user_id` |
| `entries` | DELETE | `using (auth.uid() = user_id)` |
| `user_profiles` | SELECT | `using (auth.uid() = id)` |
| `user_profiles` | INSERT | `with check (auth.uid() = id)` |
| `user_profiles` | UPDATE | `using` + `with check` on `auth.uid() = id` |

Both `with check` clauses on UPDATE close a subtle hole: without them, a malicious client could pass the `using` gate on the pre-image and then rewrite `user_id`/`id` to another user's UUID.

## Authentication flows

### Sign up
`app/(auth)/sign-up.tsx` → `supabase.auth.signUp` with `options.data` carrying `consent_given_at` and `privacy_policy_version` into `auth.users.user_metadata`. In production, email confirmation is ON, so users see a "check inbox" message until they click the link.

### Sign in
`app/(auth)/sign-in.tsx` → `supabase.auth.signInWithPassword`. Includes a "Forgot password?" link routing to `/(auth)/reset`.

### Password reset
`app/(auth)/reset.tsx` → `supabase.auth.resetPasswordForEmail(email, { redirectTo: <origin>/update-password })`. The recovery link, when clicked, lands the user on `/update-password`. Since `detectSessionInUrl: true` is set in `lib/supabase.ts`, Supabase parses the recovery token from the URL and creates a session. `app/update-password.tsx` then calls `supabase.auth.updateUser({ password })` to finalize.

### Delete account
`app/(tabs)/profile.tsx` → three-step: (1) upsert `user_profiles` with `deletion_requested_at`; (2) `entries.delete().eq('user_id', user.id)`; (3) `supabase.auth.signOut()`. The `auth.users` row itself is flagged for later hard deletion (currently a manual admin task; a scheduled edge function is a future improvement).

## Supabase client

`lib/supabase.ts`:

```ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,   // platform adapter (AsyncStorage / localStorage)
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,          // required for the reset-password flow
  },
});
```

Env vars (from `.env`, injected by Expo):

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (anon key — safe in client)

The `service_role` key must never appear in the client bundle. It bypasses RLS.

## GDPR compliance

**Shipped:**
- Data hosted in an EU Supabase region (Frankfurt).
- HTTPS everywhere (Vercel free SSL via Let's Encrypt).
- Privacy Policy at `/privacy` with a semver `PRIVACY_POLICY_VERSION` and separate `PRIVACY_POLICY_EFFECTIVE_DATE`, both in `lib/legal.ts`.
- Consent checkbox on sign-up, not pre-checked; consent metadata (timestamp + version) stored in `auth.users.user_metadata`.
- **Export my data** (Profile → Export) on web — downloads a JSON of all entries. Native shows a message directing users to the web version.
- **Delete my account** (Profile → Delete) — cascade-wipes entries, flags the auth record.
- Sign-up and Profile both link to `/privacy`.

**Not shipped (roadmap):**
- Application-level encryption of `content` before insert (currently relies on Supabase's at-rest encryption).
- Automatic `auth.users` deletion after `deletion_requested_at` (currently manual).
- Re-prompt for consent on Privacy Policy version bump.
- Native export via `expo-file-system` / `expo-sharing`.

## Cross-platform considerations

- All screens use `useTheme()`; all `<Text>` uses `AppText` (font-size scaling).
- Card `ImageBackground` sources use `getCardSource(name, mode)` which resolves platform + theme.
- Native-only features must be gated with `Platform.OS !== 'web'`. Currently the only such guard is the web-only `handleExport` on Profile.
- Auth deep links (recovery, confirmation) work on web via URL fragments and `detectSessionInUrl`. Native deep-link handling for these flows is not yet wired.

## Deployment

For end-to-end setup and deploy instructions, see **`docs/setup_tutorial.md`**. Summary:

- **Build**: `npm run build:web` → outputs `dist/`.
- **Vercel**: reads `vercel.json` (build command, output directory, SPA rewrite). Env vars set in Vercel dashboard.
- **Custom domain**: Vercel nameservers on Namecheap. HTTPS auto-issued after DNS validates.
- **Supabase URL config**: production Site URL and Redirect URLs (`/`, `/sign-in`, `/update-password`) must be added before email confirmation and reset flows work in prod. Email confirmation flipped **ON** in production.

## Future schema extensions

Planned; the current schema should accommodate them without major refactors:

- **`entry_emotions`** — many-to-many with intensity scores; would replace the current `emotion` text column.
- **`tags`** + **`entry_tags`** — user-defined organisation.
- **`mood_checkins`** — quick mood logs, no text required.
- **`media_attachments`** — file paths for photos/voice notes (files in Supabase Storage).
- **`prompts`** + `entry_prompt_answers` — pre-written journaling prompts.

## Verification checklist

Use to confirm the codebase matches this spec:

- [x] `@supabase/supabase-js` installed
- [x] `@react-native-async-storage/async-storage` installed
- [x] `react-native-url-polyfill` imported at the top of `lib/supabase.ts`
- [x] Supabase client uses the platform adapter for session storage
- [x] Supabase URL + anon key in `.env` (never the `service_role` key)
- [x] `.env` in `.gitignore`
- [x] `entries` and `user_profiles` tables created by `docs/db/supabase-setup.sql`
- [x] RLS enabled on both tables with `with check` on UPDATE
- [x] `set_updated_at` and `handle_new_user` triggers deployed
- [x] Supabase project region = `eu-central-1` (Frankfurt)
- [x] `react-native-web` installed and `npx expo start --web` launches in browser
- [x] Landing page at `/welcome` for unauthenticated visitors
- [x] Privacy Policy page at `/privacy`, linked from sign-up and Profile
- [x] Consent checkbox at sign-up, not pre-checked
- [x] Export + Delete flows in Profile
- [x] Password reset flow (`/reset` → email → `/update-password`)
- [x] `vercel.json` with SPA rewrite committed
- [ ] Custom domain resolved and HTTPS issued (in-progress at time of writing)
- [ ] Supabase Site URL + Redirect URLs point to production domain
- [x] `Confirm email` = ON in production
