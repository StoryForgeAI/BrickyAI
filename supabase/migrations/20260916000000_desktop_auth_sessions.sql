-- ===========================================================================
-- Desktop authentication sessions  (Bricky AI website → Supabase)
-- ===========================================================================
-- One-time authorization sessions for the Bricky AI desktop app's
-- browser-based sign-in handshake (see docs/DESKTOP_AUTH_SETUP.md).
--
-- How to run against the PRODUCTION Supabase project:
--   Supabase Dashboard → SQL Editor → paste this file → Run.
--   (or, with the Supabase CLI:  supabase db push)
--
-- SECURITY:
--   * Row Level Security is ENABLED with NO policies: the anon / authenticated
--     (publishable) keys shipped in the browser can NOT read or write this
--     table. Only the server-only service-role key (SUPABASE_SECRET_KEY,
--     which bypasses RLS) can access it, as used by the desktop-auth routes.
--   * Neither the desktop-app code nor a device secret is EVER stored raw —
--     only its SHA-256 hash (code_hash) is kept.
--   * Sessions are short-lived (10 minutes, enforced by the server at insert /
--     bind time) and redeemed atomically exactly once
--     (status: pending → bound → redeemed).
-- ===========================================================================

create table if not exists public.desktop_auth_sessions (
  id         uuid primary key default gen_random_uuid(),
  request_id text not null unique,
  code_hash  text not null,
  user_id    uuid references auth.users (id) on delete cascade,
  status     text not null default 'pending'
             check (status in ('pending', 'bound', 'redeemed', 'expired')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  bound_at   timestamptz,
  used_at    timestamptz
);

-- Expiry sweep: the server cleans up recycled requests by expires_at.
create index if not exists desktop_auth_sessions_expires_uidx
  on public.desktop_auth_sessions (expires_at);

-- The exchange / complete routes locate sessions by the SHA-256 hash of the
-- presented code or secret, so code_hash must be unique as well.
create unique index if not exists desktop_auth_sessions_code_hash_uidx
  on public.desktop_auth_sessions (code_hash);

-- RLS ON with NO policies: only the server-side service role can touch rows.
alter table public.desktop_auth_sessions enable row level security;