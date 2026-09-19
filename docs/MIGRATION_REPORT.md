# Migration report — Supabase → WordPress backend

Date: September 19, 2026 · Next.js 16.3.3 (Turbopack)

## 1. What changed

The website's entire authentication, account, credits, and subscription stack was
moved off Supabase and onto the live WordPress `bricky/v1` API. The browser no
longer talks to any auth backend directly: it calls Next.js BFF routes
(`/api/*`), which hold the WordPress JWT in an HttpOnly cookie and call
WordPress server-to-server. No Supabase code, tables, keys, or dependencies
remain.

## 2. Architecture

```
browser ── fetch ──▶ Next.js BFF route ── fetch ──▶ WordPress (bricky/v1, jwt-auth/v1)
   ▲                        │
   └── HttpOnly bricky_session cookie (WordPress JWT, 7 days) ──┘
```

- Session cookie: `bricky_session` — HttpOnly, `SameSite=Lax`, `Secure` in
  production, 7-day max age.
- No JWT is ever exposed to browser JS or `localStorage`.
- The only client storage is `bricky-auth-pending` (sessionStorage) for a
  deferred post-sign-in action.

## 3. Endpoints implemented

BFF routes (all under `src/app/api/`): `auth/login`, `auth/logout`,
`auth/session`, `auth/register`, `auth/verify-email`,
`auth/resend-verification`, `auth/request-password-reset`,
`auth/reset-password`, `auth/google/exchange`, `account`, `credits`,
`credit/claim-starter`, `account/delete`, and the `auth/desktop/{start,complete,exchange}`
proxies. Corresponding pages: `/login`, `/register`, `/verify-email`,
`/forgot-password`, `/reset-password`, `/auth/google/callback`, `/dashboard`.

## 4. Files

- **New API layer:** `src/lib/bricky-api.ts`, `src/lib/bricky-server.ts`,
  `src/lib/session.ts`, `src/lib/auth-errors.ts`, `src/lib/social-auth.ts`,
  `src/lib/config.ts` (updated).
- **Rewritten:** `src/context/AuthContext.tsx`, `src/lib/account.ts`,
  `src/lib/credit.ts`, `src/lib/profile.ts`, `Navbar`, download components,
  `dashboard/DashboardPage`, `pricing/PricingCards`, `DesktopAuthClient`.
- **Deleted:** `src/lib/supabase/*`, `src/lib/dashboard.ts`,
  `src/lib/subscription.ts`, `src/lib/oauth.ts`, `src/lib/desktopAuthServer.ts`,
  `src/components/auth/AuthModal.tsx`, `src/app/api/{dashboard,subscription,promo}`,
  the `supabase/` migrations directory, and the `@supabase/supabase-js`
  dependency.

## 5. Verification

- `npx tsc --noEmit` → clean.
- `npx eslint .` → clean.
- `npm run build` → succeeds; all 30 routes compiled.
- Supabase audit: zero matches in `src/`, `package.json`, `package-lock.json`,
  `next.config.ts`, `.env.example`.
- **Live smoke test (server on :3199 against `http://localhost/wordpress`):**
  13/13 passed — anonymous session, bad-password rejection, successful login +
  cookie, session restore, `/account`, `/credits`, idempotent starter-credit
  claim, and clean, honest errors for the unimplemented account-delete and
  desktop flows. No raw errors, stack traces, or tokens were returned.

## 6. Backend gaps (surfaced honestly, never faked)

| Feature | Status | User-facing behavior |
| --- | --- | --- |
| Facebook sign-in | No endpoint | "not available yet" notice; `SOCIAL_PROVIDERS.facebook.enabled = false` |
| Desktop app sign-in | No endpoint | `desktop_not_enabled` (501) |
| Account deletion | No endpoint | "not available … yet" (501) |
| Subscription purchase/cancel/promo | No endpoint | Read-only dashboard; no checkout |

## 7. Configuration / deployment

- Frontend env: `NEXT_PUBLIC_BRICKY_API_URL` (prod `https://api.brickyai.com`),
  `NEXT_PUBLIC_SITE_URL`.
- WordPress: define `BRICKY_FRONTEND_URL` in `wp-config.php`; plugins
  `bricky-ai-api` v1.4.0 + `jwt-authentication-for-wp-rest-api`; Nextend Google
  provider for social login.
- `npm install` run to drop the removed dependency and sync the lockfile
  (8 packages removed, 0 vulnerabilities).

## 8. Known limitations

- Google `exchange` depends on WordPress setting the HttpOnly
  `bricky_access_token` cookie; the BFF captures it from `Set-Cookie`.
- Starter-credit anti-abuse depends on WordPress's own `bricky_device_id`
  cookie, which the BFF forwards. Users who clear site data can re-claim — an
  accepted non-invasive-fraud tradeoff.
- Local HTTP testing must use `next dev` (the session cookie is `Secure` in
  production).

## 9. Documentation

`docs/WORDPRESS_AUTH_SETUP.md` (new, canonical), `docs/CREDITS_SETUP.md`,
`docs/GOOGLE_OAUTH_SETUP.md`, `docs/DESKTOP_AUTH_SETUP.md`,
`docs/SUBSCRIPTIONS_SETUP.md` rewritten to the WordPress contract;
`docs/AUDIT_REPORT.md` annotated as historical.

## 10. Status

Complete and verified against the live backend. The four backend gaps in
section 6 are the only outstanding work, and each is isolated behind a clean
error path rather than a fake implementation.
