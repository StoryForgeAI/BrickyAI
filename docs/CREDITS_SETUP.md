# Starter credits — one-time, server-side entitlement

Bricky AI gives every new account a starting credit balance (currently **80
credits**). Because credits are a promotional entitlement, the grant must be
**one-time per account AND one-time per browser/device environment**. A user
must not be able to log out, sign in with a second Google account, and receive
another 80 credits on the same device.

This document explains the server-controlled mechanism. The short version:

- The grant is decided by a **Postgres function** on the server, never by the
  browser.
- A `starter_credit_claims` table records that a browser and/or an account has
  already claimed the starter reward. `UNIQUE` constraints make the check
  atomic and race-safe.
- A persistent, **HttpOnly** `bricky_device_id` cookie identifies the
  browser/device environment. The client cannot read or forge it, and it
  contains no personal or hardware information.
- The balance lives in `profiles.credits`, which the browser can only ever
  **read** — it can never update it.

## 1. What runs on the client

After a session is restored, the website calls this route once per session:

```
POST /api/credit/claim-starter
Authorization: Bearer <access token from the signed-in session>
```

The route:

1. Validates the caller with the access token (server-side).
2. Ensures a `profiles` row exists for the user (upsert, idempotent).
3. Reads the `bricky_device_id` cookie, creating and setting it if absent
   (random UUID, `HttpOnly`, `SameSite=Lax`, `Secure`, ~400 days, survives
   logout — it is never cleared by the app).
4. Calls the `claim_starter_credits(browser_id, user_id)` Postgres function,
   which atomically records the claim and grants credits (or not) inside one
   transaction.
5. Returns `{ granted: boolean, credits: number }`. The client only shows the
   server-computed balance; it never decides.

Repeated calls are harmless: the function is idempotent and returns the same
result once a claim exists.

## 2. Database setup (run once in the Supabase SQL editor)

```sql
-- Ledger of starter-credit claims. browser_id is an opaque HttpOnly cookie
-- value; user_id references the account. user_id is intentionally NOT
-- cascade-deleted with the account so that deleting an account does NOT
-- "un-claim" the browser (prevents delete-and-reclaim farming).
create table if not exists public.starter_credit_claims (
  id             uuid primary key default gen_random_uuid(),
  browser_id     text not null unique,
  user_id        uuid references auth.users (id) on delete set null,
  credits_granted integer,
  created_at     timestamptz not null default now()
);

-- One starter grant per account, ever (even across devices/browsers).
create unique index if not exists starter_credit_claims_user_uidx
  on public.starter_credit_claims (user_id);

-- Grant columns needed by the function (idempotent).
alter table public.profiles
  add column if not exists credits numeric,
  add column if not exists email_verified boolean,
  add column if not exists subscription text,
  add column if not exists subscription_expires_at timestamptz;

create or replace function public.claim_starter_credits(p_browser_id text, p_user_id uuid)
returns table (granted boolean, credits integer)
language plpgsql
security definer set search_path = public
as $$
declare
  v_credits integer;
begin
  -- The single atomic gate. If this insert violates the UNIQUE constraint on
  -- browser_id (device already claimed) or on user_id (this account already
  -- claimed), the whole call fails with a unique-violation and nothing else
  -- happens. That makes concurrent double-claims impossible: only one caller
  -- can win the insert.
  insert into public.starter_credit_claims (browser_id, user_id, credits_granted)
  values (p_browser_id, p_user_id, 80);

  -- Grant 80 only to accounts that have never received credits (NULL or 0).
  -- Accounts that already carry a balance (e.g. provisioned earlier) are left
  -- untouched — we record the claim so they can never re-claim.
  update public.profiles
     set credits = 80
   where id = p_user_id and (credits is null or credits <= 0)
   returning credits into v_credits;

  if v_credits is null then
    select credits into v_credits from public.profiles where id = p_user_id;
    return query select false, coalesce(v_credits, 0);
  end if;

  return query select true, v_credits;
end;
$$;

-- The browser must never call this function directly. Only the server's
-- service-role client may execute it.
revoke execute on function public.claim_starter_credits(text, uuid) from public, anon, authenticated;
grant execute on function public.claim_starter_credits(text, uuid) to service_role;
```

> **Important — profile trigger:** if your `profiles` trigger (the one that
> creates a row on `auth.users` insert) also sets a `credits` value, remove
> that from the trigger. The trigger should create the row (id, email only);
> the starter grant is owned exclusively by `claim_starter_credits`, so the
> account starts with `credits = NULL` and receives exactly **80** the first
> time the claim is requested. If the trigger already granted some amount, the
> function detects an existing balance, records the claim, and leaves that
> balance untouched.

### Backfilling existing users (optional, recommended)

Put a claim on file for every existing account that already has a credit
balance so they can never claim the new starter reward a second time:

```sql
insert into public.starter_credit_claims (browser_id, user_id, credits_granted, created_at)
select 'backfill-' || id::text, id, credits::integer, now()
from public.profiles
where credits is not null and credits > 0
on conflict do nothing;
```

## 3. Cookie details

| Property     | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Name         | `bricky_device_id`                                           |
| Value        | random UUID v4                                               |
| HttpOnly     | yes — JS cannot read or write it                             |
| Secure       | yes in production                                            |
| SameSite     | `Lax`                                                        |
| Path         | `/`                                                          |
| Max-Age      | ~400 days, refreshed on every claim attempt                  |
| Data content | none — opaque random id only; not a fingerprint, no hardware info |

The cookie is a **necessary** anti-abuse token used only to decide whether this
browser environment has already received the starter entitlement. It is not
used for advertising or tracking and is described as such in the Privacy Policy
(Section 15).

Because it survives logout and re-login, the browser environment stays
"claimed" even after the account is changed.

## 4. What the rails look like (expected behavior)

- Account A signs in on a device → `granted: true`, `credits: 80`.
- Account A signs out, Account B signs in on the same device → unique
  `browser_id` conflict → `granted: false`, B keeps its (zero) balance.
- Account A signs back in → its stored balance is restored, no second grant.
- Page refresh / browser restart → claim already recorded → no second grant.
- Two simultaneous claim calls (same device, different accounts) → the first
  insert wins, the second gets a unique-violation → exactly one grant.
- Deleting the account does not delete the claim → the device stays claimed.

A user who deliberately clears all site data (or switches browser/device/private
mode) may claim again on that fresh environment. That is an accepted limitation
of non-invasive anti-fraud — the mechanism stops normal multi-account credit
farming without fingerprinting the user.

## 5. Security model

- `SUPABASE_SECRET_KEY` stays server-only (never `NEXT_PUBLIC_*`); it is the
  only credential that can write `profiles.credits` or execute the claim RPC.
- The browser's Supabase key has **no `UPDATE` grant on `profiles`** and the
  claim function is `revoke ... from anon, authenticated` — so a signed-in
  client can never mint credits, change its own subscription, or extend an
  expiry. Only `service_role` (server) can.
- Never trust `user_id`, credit amounts, "first login" flags, or localStorage
  from the client. The server derives `user_id` from the validated access
  token and the grant amount is a constant in the function.