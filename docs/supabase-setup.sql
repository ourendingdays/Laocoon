-- Laocoon — Supabase setup
--
-- Run this once in Supabase Dashboard → SQL Editor.
-- Safe to re-run: every statement is idempotent.
--
-- Assumes the `entries` table already exists with columns from docs/laocoon-spec.md:
--   entry_id uuid PK, user_id uuid FK auth.users(id) on delete cascade,
--   title text, content text not null, created_at timestamptz, updated_at timestamptz, emotion text.

-- 1. Row Level Security on entries
alter table public.entries enable row level security;

drop policy if exists "Users see own entries" on public.entries;
create policy "Users see own entries"
  on public.entries for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own entries" on public.entries;
create policy "Users insert own entries"
  on public.entries for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own entries" on public.entries;
create policy "Users update own entries"
  on public.entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users delete own entries" on public.entries;
create policy "Users delete own entries"
  on public.entries for delete
  using (auth.uid() = user_id);

-- 2. Auto-bump updated_at on every UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.entries;
create trigger set_updated_at
  before update on public.entries
  for each row execute function public.set_updated_at();

-- 3. user_profiles — GDPR consent tracking
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  consent_given_at timestamptz,
  privacy_policy_version text,
  deletion_requested_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.user_profiles enable row level security;

drop policy if exists "Users see own profile" on public.user_profiles;
create policy "Users see own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

drop policy if exists "Users insert own profile" on public.user_profiles;
create policy "Users insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.user_profiles;
create policy "Users update own profile"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop trigger if exists set_updated_at on public.user_profiles;
create trigger set_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();
