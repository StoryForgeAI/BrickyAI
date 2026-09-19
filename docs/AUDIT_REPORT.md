# Bricky AI — Legal, Privacy, Security & Third-Party Audit Report

Date: September 16, 2026
Audited codebase: `D:\BrickyAI_WEB` (Next.js 16.3.3, Turbopack)

> **Note (September 19, 2026):** the authentication/account/credits/subscription
> stack described in this report as Supabase has since been migrated to the
> WordPress `bricky/v1` backend behind a Next.js BFF. Read
> `docs/WORDPRESS_AUTH_SETUP.md` for the current architecture and
> `docs/MIGRATION_REPORT.md` for the change set. Supabase references below are
> historical.

This report documents what the website actually does with data, the changes made so
that the legal documents and UI match that reality, and the items that still require
operator or legal input. It deliberately does **not** claim the website is "100%
legally compliant worldwide" — several conclusions below are explicitly marked as
requiring professional legal review.

---

## 1. Company identity

- `src/lib/company.ts` is the single source of truth for the operator identity.
- Fixed the operator name from the placeholder/typo `Rapidline KKFT` to
  **Rapidline Kft.** per operator instruction, and removed a hardcoded duplicate
  (`src/components/legal/CompanyInfo.tsx` previously printed `Rapidline KKFT` instead
  of reading from config).
- All other company fields are still explicit placeholders and were **not** invented
  (address, registration number, tax/VAT number, registry details, legal contact email).

**Action required (operator):** Fill in the bracketed values in `src/lib/company.ts`
before inviting users to rely on the legal documents. The UI shows a "Pending" badge
until then.

## 2. Third-party services inventory

The website depends on exactly **three** third parties today:

| Provider | Role | Data seen |
|---|---|---|
| **Google** | Authentication (OAuth, "Continue with Google") | Email address + verification status; account identifier; scopes configured in Supabase |
| **Supabase** | Auth backend, account data, database (incl. desktop sign-in sessions), credits/subscription fields | Email, user ID, sessions, profile row, claims |
| **Vercel** | Website hosting | Standard request logs (IP, device/browser, timestamps) |

No analytics, advertising, tracking, error-monitoring, email-sending, or payment
services are present (`package.json` confirmed — no `google-analytics`, `gtag`,
`sentry`, `segment`, `stripe`, etc.).

## 3. Payments — not implemented (Stripe does not exist)

- There is **no** Stripe or any payment integration in the codebase: no dependency,
  no checkout/billing API routes, nothing that can charge a user.
- The pricing UI says so honestly (`PricingCards.tsx`: "checkout is being set up —
  nothing is charged until it's live") and the "Continue to checkout" button only
  shows an inline status message; it never requests payment details.
- The legal documents previously **falsely claimed** payments were processed by
  third-party providers. See items 15 and 16 for the corrections.

**Action required (operator):** Do not advertise checkout as functional until a real
payment provider is integrated. Re-audit the moment Stripe (or another processor) is
added.

## 4. Google OAuth

- Google is the only sign-in method; no email/password, signup, or password-reset UI.
- The browser client requests no extra OAuth scopes beyond the Supabase Google provider
  defaults. The app only **stores** email + `email_verified`; name/photo are not stored.
- Privacy Policy §7 was tightened to state exactly that (previously it hedged with
  "depending on configuration" and implied broader profile storage).
- OAuth redirect origin is dynamic (`src/lib/oauth.ts`): `NEXT_PUBLIC_SITE_URL` in
  production, current page origin in dev/preview — no hardcoded localhost.
- Docs: `docs/GOOGLE_OAUTH_SETUP.md` documents the Google OAuth client configuration,
  including the redirect URL.

**Action required (operator):** Confirm the configured Google scopes match the claim
in Privacy Policy §7 (email + verification; no extra scopes). Set `NEXT_PUBLIC_SITE_URL`
= `https://bricky-ai.vercel.app` (or your custom domain) in Vercel production.

## 5. Supabase infrastructure

- Browser uses only the publishable key with PKCE (`persistSession`, `autoRefreshToken`,
  `detectSessionInUrl`, `flowType: "pkce"`). The secret (`SUPABASE_SECRET_KEY`, legacy
  alias `SUPABASE_SERVICE_ROLE_KEY`) is server-only, guarded by `server-only` imports.
- Server routes (`/api/credit/claim-starter`, `/api/account/delete`,
  `/api/auth/desktop/*`) validate the caller's access token via the admin client and
  never trust client-supplied user IDs.
- Verified: no secret references exist in any client bundle under `.next/static`.

## 6. Vercel hosting

- Privacy Policy §21 discloses Vercel as the hosting platform and that it processes
  standard technical data (IP, request metadata, timestamps).
- No further change required. The pricing page also lists Vercel correctly.

## 7. Cookies & browser storage (what actually exists)

| Item | Type | Purpose |
|---|---|---|
| `bricky_device_id` | Cookie, HttpOnly, SameSite=Lax, Secure in prod, ~400 days | Server-side one-time starter-credit anti-farming |
| `sb-…-auth-token` (+ related PKCE entries) | Browser localStorage | Supabase auth session |
| `bricky-consent` | Browser localStorage | Cookie-consent record (version 1) |
| `bricky-auth-pending` | Browser sessionStorage | Deferred action to run after sign-in (e.g. download); cleared on use/cancel |

- Privacy Policy §15/§16 now describe these accurately, including that the auth session
  and consent record are browser storage rather than cookies (previously conflated).

## 8. Cookie consent UI

- Banner, settings modal, and footer `Cookie Settings` button all read/write
  `bricky-consent`.
- Categories: **Necessary** (always on) and **Preferences** (off by default).
- Corrected copy so claims match reality:
  - Necessary: explicitly notes "some of these are stored in a cookie and some in
    browser storage".
  - Preferences: now states "No such feature is active today. Off by default." —
    previously the modal implied a preference feature that stores data.
  - Banner now says "essential session storage (a cookie and browser storage)".
- Privacy Policy §15/§16 and Terms §34 cross-reference the footer Cookie Settings.

## 9. Login UI disclosure

- `AuthModal` (site-wide modal behind "Log in"/"Download") now explicitly says:
  "Authentication is provided through Google and handled securely by Supabase.
  See the Privacy Policy for what each of them processes."
- It already linked Terms of Service, Privacy Policy, and Cookie Settings.
- The desktop sign-in page (`DesktopAuthClient`) already disclosed the Google +
  Supabase split and links Terms/Privacy.

## 10. Payment / pricing UI disclosure

- Pricing cards and the pre-checkout modal keep stating nothing is charged yet; the
  modal's sample plan copy ("{name} — {price}/month") is clearly labeled as the
  *selected* plan, not a charge.
- Pricing page tax line now reads "Applicable taxes, where they apply, will be
  calculated at checkout once online payment becomes available" (was a present-tense
  implied capability).
- Terms §26/§28 and Pricing FAQ now consistently state subscriptions are not yet
  purchasable online.

## 11. Downloads & access control

- Download gating (`DownloadCards`, `DownloadAuthStatus`) is a **client-side consent
  gate**: access to the binaries is controlled by the configured
  `NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL` / `NEXT_PUBLIC_PLUGIN_DOWNLOAD_URL` endpoints.
  This is a conversion/marketing gate, not a hard security boundary.
- The legal documents do **not** overclaim hard access control, so no correction was
  needed; nothing in privacy/terms claims downloads are cryptographically protected.
- Defaults are `"#"` until real files exist (`src/lib/config.ts`), so the UI does not
  pretend downloads are live.

**Action required (operator):** Set the two download URL env vars (or drop files into
`public/downloads/`) before revealing "/download" prominently, and decide whether
downloads should be server-gated (e.g. cookie/session check) if true access control is
desired.

## 12. Dashboard / account & the delete flow

- There is **no dashboard page**. Account data (email, plan, credits) is displayed in
  the Navbar account menu, read-only; credits/subscription are server-managed values.
- Account deletion is server-side (`/api/account/delete`): Bearer-validated, uses
  `admin.auth.admin.deleteUser`, returns generic errors. UI has a two-step confirmation.
- Privacy Policy §31 now states the deletion covers desktop sign-in sessions bound to
  the account; Terms §33 already described deletion.

## 13. Promo codes / credits anti-farming

- The only promotional entry point is the **one-time 80-credit starter grant**
  (`/api/credit/claim-starter`). There is no promo-code system.
- Anti-farming is server-side and correct:
  - HttpOnly `bricky_device_id` cookie (not readable by JS) + atomic Postgres
    `claim_starter_credits(browser_id, user_id)` with unique constraints;
  - browser can only ever read the balance, never set it;
  - 409/23505 handled as "already claimed" rather than errors.
- Privacy Policy §10 and the cookie modal describe the 80-credit grant and the device
  cookie accurately.
- Setup: `docs/CREDITS_SETUP.md`.

## 14. Environment variables & secrets

| Variable | Visibility | Note |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client-safe | – |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | client-safe | legacy alias `…_ANON_KEY` |
| `SUPABASE_SECRET_KEY` | server-only | legacy alias `SUPABASE_SERVICE_ROLE_KEY`; must never become `NEXT_PUBLIC_*` |
| `NEXT_PUBLIC_SITE_URL` | client-safe | canonical origin; `https://bricky-ai.vercel.app` |
| `NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL` / `NEXT_PUBLIC_PLUGIN_DOWNLOAD_URL` | client-safe | download endpoints |
| `NEXT_PUBLIC_LAUNCH_APP_URL` | client-safe | optional deep link |

- Verified: `.next/static` client chunks contain no `SUPABASE_SECRET_KEY`,
  `SERVICE_ROLE`, or other secret references; `localhost` appears only in code comments.
- `src/app/layout.tsx` now derives `metadataBase`/OG URL from `siteOrigin`
  (`NEXT_PUBLIC_SITE_URL` override, else config fallback) so canonical links follow the
  production origin. Note: the fallback `siteConfig.url` is `https://brickyai.com` —
  confirm whether that is the intended canonical domain (see item 17).

## 15. Privacy Policy — corrections (all applied)

Inaccurate claims removed / corrected in `src/app/privacy/page.tsx`:

1. **§12 *Payment information*** → retitled "Payment information (not yet available)":
   states no payment data is collected and nothing can be charged; future checkout
   will be handled by a third-party processor that will not see Bricky-ai-side full
   card numbers.
2. **§22 *Other third-party providers*** → removed the false "error monitoring,
   transactional email, and payment processing" claim; documents Google/Supabase/Vercel
   as the current providers and that no analytics/error-monitoring/advertising is used.
3. **§15/§16 Cookies & local storage** → accurate separation of the cookie
   (`bricky_device_id`) from browser-storage items (auth session, consent, deferred
   action); disclosed `bricky-auth-pending`.
4. **§21 Supabase** → added a full paragraph on **desktop sign-in sessions**: one-time,
   ≤10 minutes, only the SHA-256 hash of the credential stored, bound to the user ID,
   cascade-deleted with the account.
5. **§23 Transfers** → avoided fabricating a specific mechanism not backed by config;
   now ties safeguards to the providers' data processing agreements (SCCs / adequacy
   decisions where applicable) — still flagged for legal review.
6. **§24 Retention** → added desktop-session lifetime and backup/log cycle-out.
7. **§31 Deletion** → desktop sign-in sessions included.
8. **§5/§6/§7/§10** → no longer imply support-messaging channels, marketing email, or
   purchase history that do not exist; Google profile data limited to email +
   verification status; credits/plan status described as server-managed with 80-credit
   starter grant and Free tier as today's only plan.
9. `lastUpdated` → September 16, 2026.

## 16. Terms of Service — corrections (all applied)

Inaccurate claims removed / corrected in `src/app/terms/page.tsx`:

1. **§26 Subscriptions** → now opens with "Paid subscriptions are **not yet
   available**"; the auto-renewal wording is explicitly scoped to "when paid
   subscriptions are introduced."
2. **§28 Payments and billing** → now opens with "Online payment is **not yet
   available**"; the "processed by third-party payment providers / we don't store your
   card" wording is future-tense.
3. Retitled wording consistent with Pricing FAQ and the pricing page. `lastUpdated` →
   September 16, 2026.

## 17. Security review, verification, and remaining questions

### Applied code fixes
- Company-name normalization (config + component hardcode) — consistency, prevents
  drifting copies of the operator name.

### Verified (no change needed)
- No secret exposure in client bundles; `server-only` guard on the secret client.
- Server routes validate Bearer tokens; client user IDs are never trusted.
- Desktop auth: atomic redeem, hashed secrets, RLS enabled with no policies on
  `desktop_auth_sessions`; `/auth/desktop` is `robots: noindex`.
- Claim-starter: HttpOnly device cookie; server-side uniqueness for anti-farming.

### Verification performed
- `npm run lint` — pass.
- `npx tsc --noEmit` — pass.
- `npm run build` — pass (14 routes).
- `npm start` smoke — `/privacy`, `/terms`, `/pricing` return 200 with the corrected
  copy present; `npm run src` grep confirmed no stale claims remain.
- Grep for `Rapidline KKFT` — none left.

### Remaining manual configuration (operator)
1. Fill company placeholders in `src/lib/company.ts`.
2. Run `supabase/migrations/20260916000000_desktop_auth_sessions.sql` in the
   **production** Supabase SQL Editor (the website returns 501 on desktop auth /
   credits / account-delete routes until Supabase env vars exist in Vercel).
3. Set Vercel env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
   `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL=https://bricky-ai.vercel.app`,
   download URLs (when binaries exist).
4. Confirm Google OAuth scopes and the Google redirect URL
   `https://bricky-ai.vercel.app/auth/v1/callback`.

### Remaining questions requiring professional legal review
- Validity of the international-transfer wording (SCCs / adequacy decisions) once the
  operator confirms actual sub-processor processing locations.
- Governing-law/jurisdiction clause given the operator country (Hungary) and the
  international user base.
- Whether the Cookie Settings "Preferences" category should be shown at all now that no
  feature uses it (it is honest — "No such feature is active today" — but legal counsel
  may prefer removing the toggle).
- Whether `siteConfig.url` (`https://brickyai.com`) is the intended canonical domain or
  should be set to `https://bricky-ai.vercel.app` / a future custom domain.
- This audit covers the *current* code, not future integrations (Stripe, email service,
  analytics). Re-run when any are added.