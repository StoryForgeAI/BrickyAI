# Desktop application sign-in (browser-based handshake)

The Bricky AI desktop app authenticates through the website using a
**device-flow style browser handshake**. The app opens a browser window at
`/auth/desktop`, the user signs in with Google (Supabase OAuth — the **only**
sign-in method), and the app then exchanges a short-lived, single-use
authorization for a verified account snapshot. The website stays the
authoritative account system (profiles, credits, subscriptions).

## 1. The flow

```
Desktop app (Tauri)
   │  1. POST /api/auth/desktop/start
   │     → { request_id, device_secret, expires_in, redirect_url }
   ▼
User's default browser opens  redirect_url  (/auth/desktop?request_id=…)
   │  2. User clicks "Continue with Google" (existing Supabase Google OAuth)
   │  3. POST /api/auth/desktop/complete  (Bearer access token + request_id)
   │     → the request is bound to the authenticated user
   │  4. Website shows "You're signed in!" then returns the browser to "/"
   ▼
Desktop app (Tauri)
   │  5. POST /api/auth/desktop/exchange  { request_id, device_secret }
   │     → atomically redeemed (single-use)
   │     → { status: "authenticated", user: { id, email, email_verified,
   │          credits, subscription, subscription_expires_at } }
   ▼
Desktop app is authenticated locally against the authoritative backend
```

Security properties:

- The **`device_secret` is 256 bits of randomness**, generated server-side,
  returned exactly once to the desktop app, **never sent to the browser** and
  **never placed in a URL**.
- The database stores only the **SHA-256 hash** of the secret.
- The code **expires quickly** (10 minutes total) and is **single-use** —
  redemption is a single atomic `UPDATE … WHERE status = 'bound'`, so exactly
  one exchange can ever win.
- The request only becomes usable after a **validated Supabase session**
  binds it to a user id (`complete`).
- `SUPABASE_SECRET_KEY` is used **only server-side** (Vercel env var); it never
  reaches the browser, the page HTML, a URL, or any API response.
- No permanent tokens are created. The desktop app re-authenticates whenever
  its local session needs refreshing.

## 2. Environment variables (Vercel production)

No new secret is required. The desktop flow reuses the existing variables.
On the **Vercel production environment** set:

| Variable | Purpose |
| -------- | ------- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (client + server) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public/anon key (client only) |
| `SUPABASE_SECRET_KEY` | server-only secret key — **never** `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SITE_URL` | `https://bricky-ai.vercel.app` — used to build the browser `redirect_url` and the post-Google-login redirect |

`NEXT_PUBLIC_SITE_URL` is **not a secret**; it is the site origin. It
deterministically prevents any production redirect to `localhost`.

There is **no hardcoded localhost** anywhere in the flow: the OAuth
`redirectTo` (browser) and the `/auth/desktop` `redirect_url` (server) are both
built from `NEXT_PUBLIC_SITE_URL` when set, falling back to the current origin
in local development.

## 3. Supabase database setup (run once in the SQL editor)

```sql
-- One-time desktop authorization sessions. The raw device secret is NEVER
-- stored — only its SHA-256 hash. The row becomes usable only after a browser
-- (validated Supabase session) binds it to a user; it is then redeemed
-- atomically exactly once.
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

create index if not exists desktop_auth_sessions_expires_uidx
  on public.desktop_auth_sessions (expires_at);

-- The browser (anon/authenticated roles) must never touch this table. Enabling
-- RLS with NO policies keeps it accessible only to service_role (server),
-- whose service key bypasses RLS.
alter table public.desktop_auth_sessions enable row level security;
```

> Only `service_role` can read/write the table, so the publishable/anon key
> shipped in the browser cannot start, bind, or redeem desktop auth requests.

## 4. API contract

### `POST /api/auth/desktop/start` — desktop app, pre-login

No auth required. Returns:

```json
{
  "request_id": "…",             // public identifier, pass to the browser
  "device_secret": "…",          // 256-bit secret, returned exactly once
  "expires_in": 600,             // seconds
  "redirect_url": "https://bricky-ai.vercel.app/auth/desktop?request_id=…"
}
```

Then the app opens `redirect_url` in the default browser.

### `POST /api/auth/desktop/complete` — browser, after Google sign-in

`Authorization: Bearer <access token>`; body `{ "requestId": "…" }`.

- `200 { "ok": true }` — bound (re-binding the same account is idempotent).
- `401` — no/invalid session.
- `400` — unknown request id.
- `409` — already bound to a different Google account.
- `410` — expired or already used.

### `POST /api/auth/desktop/exchange` — desktop app

Body `{ "requestId": "…", "deviceSecret": "…" }`.

- `202 { "status": "pending" }` — browser not done yet; **poll again**.
- `200 { "status": "authenticated", "user": {…} }` — success. `user` is the
  verified account snapshot (`id`, `email`, `email_verified`, `credits`,
  `subscription`, `subscription_expires_at`). No tokens are minted.
- `400` — invalid request, or the secret does not match.
- `410 { "code": "expired" | "already_used", "error": "…" }` — terminal; stop
  polling and start a fresh flow.

### Expected polling behavior (desktop app)

`pending` ⟶ wait ~2s and call `exchange` again (stop after `expires_in`
seconds). Any 400/410 is terminal.

## 5. Desktop app (Tauri) integration sketch

```rust
// 1. Start the handshake.
let start = http_post("/api/auth/desktop/start", json!({}));
let request_id = start.request_id;
// Keep device_secret only in memory (never persisted unencrypted).

// 2. Open the browser.
opener::open(&start.redirect_url)?;

// 3. Poll until the user finishes signing in.
loop {
    let res = http_post("/api/auth/desktop/exchange",
        json!({ "requestId": request_id, "deviceSecret": device_secret }));
    match res.status {
        "pending" => sleep(2s).await,
        "authenticated" => { store(res.user); break; }
        _ => { /* expired / already_used / invalid — restart */ }
    }
}
```

## 6. Relationship to existing systems

- **Google-only**: the `/auth/desktop` page reuses the site's existing Supabase
  Google OAuth (`signInWithOAuth`), the exact same provider and callback as the
  normal website login. No second provider, no email/password, no credential
  entry.
- **Normal login unchanged**: `/`, `/download`, and the navbar "Log in" all
  keep their existing flow. `/auth/desktop` is an additional entry point only.
- **Credits**: the starter-credit claim is untouched and remains server
  controlled (`starter_credit_claims` + the `bricky_device_id` HttpOnly cookie
  + the `claim_starter_credits` RPC). Signing in via the desktop flow is still
  a browser login, so the same anti-alt-account rules apply. The desktop
  `exchange` route performs an idempotent `profiles` upsert of `id`/`email`
  only — it can never grant credits.
- **Subscriptions**: the app receives subscription data only from the
  authoritative backend (`profiles.subscription` /
  `subscription_expires_at`). It cannot claim a subscription by itself.
- **Logout / session persistence**: unchanged. `signOut()` revokes the Supabase
  session; persisted sessions are restored via Supabase's normal PKCE handling.
  Logging out does not delete credits/subscription/profile and does not reset
  the starter-credit entitlement.
- **Cookies**: no new cookies are introduced. The desktop flow reuses
  Supabase's normal session storage and the existing necessary `bricky_device_id`
  cookie; the consent UI already explains these as necessary.

## 7. Error handling

The website shows friendly, human-readable errors only — never raw JSON, stack
traces, database/Supabase internals, or tokens. The `?error=access_denied`
return from Google (cancelled) is rendered inline on the page. Expired, used,
invalid, and network failures all surface as plain-language messages with
"Try again" / "Return to Bricky AI" actions.

## 8. Security checklist

- [x] `SUPABASE_SECRET_KEY` is server-only, never in client bundles/URLs/HTML/responses.
- [x] No permanent tokens; the device secret is 256-bit random, single-use, 10-minute TTL.
- [x] Only the SHA-256 hash of the secret is stored.
- [x] Atomic redemption prevents double-use under concurrency.
- [x] No production redirect to `localhost`; `NEXT_PUBLIC_SITE_URL` drives all origins.
- [x] Credits/starter grants remain server-controlled and unchanged.