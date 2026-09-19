# Bricky AI — WordPress backend setup (authentication, account, credits, subscriptions)

This is the single source of truth for how the website talks to the Bricky AI
WordPress backend. It replaces the former Supabase documentation.

## Architecture (one sentence)

The browser only ever talks to **this Next.js app's server** (`/api/*`); the
server holds the WordPress JWT in an HttpOnly cookie and calls WordPress with
`Authorization: Bearer …`.

```
browser ── fetch ──▶ Next.js BFF route ── fetch ──▶ WordPress `bricky/v1` + `jwt-auth/v1`
   ▲                        │                                   │
   └── HttpOnly cookie ─────┘ (bricky_session = WordPress JWT, 7 days)
```

Nothing auth-related is stored in `localStorage`. The only client-side storage
is `bricky-auth-pending` (sessionStorage, a deferred action after sign-in).

## Configuration

| Variable | Where | Value |
| --- | --- | --- |
| `NEXT_PUBLIC_BRICKY_API_URL` | `.env.local` / Vercel | local `http://localhost/wordpress`; prod `https://api.brickyai.com` |
| `NEXT_PUBLIC_SITE_URL` | `.env.local` / Vercel | canonical frontend origin (used for post-auth links) |

On the **WordPress** side, define `BRICKY_FRONTEND_URL` in `wp-config.php` so
Google sign-in redirects back to this app's `/auth/google/callback`. Required
plugins: `bricky-ai-api` (v1.4.0) and `jwt-authentication-for-wp-rest-api`.

When `NEXT_PUBLIC_BRICKY_API_URL` is unset, sign-in is disabled: pages render,
downloads are plain links, and the dashboard shows an "unconfigured" state.

## Backend contract used by this app

| Feature | WordPress endpoint | BFF route |
| --- | --- | --- |
| Email/password login | `POST /wp-json/jwt-auth/v1/token` `{username,password}` | `POST /api/auth/login` |
| Register | `POST /wp-json/bricky/v1/auth/register` `{email,password,name}` | `POST /api/auth/register` |
| Verify email | `GET  /wp-json/bricky/v1/auth/verify-email?token=` | `GET  /api/auth/verify-email` |
| Resend verification | `POST /wp-json/bricky/v1/auth/resend-verification` `{email}` | `POST /api/auth/resend-verification` |
| Request password reset | `POST /wp-json/bricky/v1/auth/request-password-reset` `{email}` | `POST /api/auth/request-password-reset` |
| Complete password reset | `POST /wp-json/bricky/v1/auth/reset-password` `{key,login,password}` | `POST /api/auth/reset-password` |
| Google start | `GET  /wp-json/bricky/v1/auth/google/start` (full-page nav) | client `startGoogleFlow()` |
| Google exchange | `POST /wp-json/bricky/v1/auth/google/exchange` `{code}` | `POST /api/auth/google/exchange` |
| Account | `GET  /wp-json/bricky/v1/account` | `GET  /api/account` |
| Credits | `GET  /wp-json/bricky/v1/credits` | `GET  /api/credits` |
| Starter credits | `POST /wp-json/bricky/v1/credit/claim-starter` | `POST /api/credit/claim-starter` |
| Session restore | – (validates JWT via `/account`) | `GET  /api/auth/session` |
| Sign out | `POST /wp-json/bricky/v1/auth/logout` (best-effort) | `POST /api/auth/logout` |

### Session cookie

`bricky_session` — HttpOnly, `SameSite=Lax`, `Secure` in production, 7-day
`maxAge` (matches `BRICKY_ACCESS_TOKEN_LIFETIME`). Set on login and on the
Google exchange; cleared on logout and whenever WordPress rejects the token.

### Google sign-in

1. Browser navigates (full page, never `fetch`) to
   `{BRICKY_API_URL}/wp-json/bricky/v1/auth/google/start`.
2. WordPress/Nextend returns to `{BRICKY_FRONTEND_URL}/auth/google/callback?code=…`.
3. `/auth/google/callback` calls `POST /api/auth/google/exchange`.
4. WordPress sets its own `bricky_access_token` cookie; the BFF **captures**
   that value out of the upstream `Set-Cookie` and re-issues it as
   `bricky_session`. The browser never sees the JWT.
5. The deferred post-sign-in action (if any) runs, then the user returns to the
   page they came from.

### Password reset links

WordPress emails a link to `/reset-password?key=…&login=…`; the page forwards
`{key, login, password}` to the backend. Verification links point at
`/verify-email?token=…` and are single-use.

### Credits

The backend decides entitlements. The one-time 80-credit starter grant is
`POST /credit/claim-starter`; the backend enforces one claim per account **and**
per browser via its own HttpOnly `bricky_device_id` cookie (the BFF forwards the
browser cookies so this keeps working). The client only ever reads the balance.

## Local development

1. Start Apache/MySQL (XAMPP) and ensure WordPress is served at
   `http://localhost/wordpress`.
2. Copy `.env.example` to `.env.local` and set
   `NEXT_PUBLIC_BRICKY_API_URL=http://localhost/wordpress`.
3. `npm run dev`.

## Known backend gaps (not yet implemented in the plugin)

These are surfaced to users as clean, honest messages — never faked:

- **Facebook sign-in** — no `/auth/facebook/*` endpoints. The UI offers the
  button (per product requirement) but clicking it shows a "not available yet"
  notice. Backend work: add a Nextend Facebook provider + `auth/facebook/*`.
- **Desktop app sign-in** — no `/auth/desktop/*` endpoints. The routes exist and
  forward to the expected contract, returning `desktop_not_enabled` (501) today.
- **Account deletion** — no delete endpoint. `POST /api/account/delete` returns
  a clear "not available yet" message.
- **Subscription purchase/cancel/promo** — no such endpoints; the dashboard is
  read-only and the pricing page's paid CTAs lead to the dashboard.
