-- Laocoon — Supabase setup
--
-- Run this once in Supabase Dashboard → SQL Editor on a fresh project,
-- or re-run any time to reconcile drift.
-- Safe to re-run: every statement is idempotent.
--
-- Order matters within this file: table creation → RLS policies → triggers → auto-provisioning.

-- ============================================================
-- 1. entries — the diary table
-- ============================================================

create table if not exists public.entries (
  entry_id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  content text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  emotion text
);

-- Turn on Row Level Security
alter table public.entries enable row level security;

-- Users can only see their own entries
drop policy if exists "Users see own entries" on public.entries;
create policy "Users see own entries"
  on public.entries for select
  using (auth.uid() = user_id);

-- Users can only insert their own entries
drop policy if exists "Users insert own entries" on public.entries;
create policy "Users insert own entries"
  on public.entries for insert
  with check (auth.uid() = user_id);

-- Users can only update their own entries
drop policy if exists "Users update own entries" on public.entries;
create policy "Users update own entries"
  on public.entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can only delete their own entries
drop policy if exists "Users delete own entries" on public.entries;
create policy "Users delete own entries"
  on public.entries for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 2. Auto-bump updated_at on every UPDATE
-- ============================================================

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

-- ============================================================
-- 3. user_profiles — GDPR consent tracking
-- ============================================================

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

-- ============================================================
-- 4. Auto-create a user_profiles row when a new auth user signs up
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: create a profile row for every existing user
-- (safe on re-run — the `on conflict do nothing` skips existing rows).
insert into public.user_profiles (id)
select id from auth.users
on conflict (id) do nothing;
