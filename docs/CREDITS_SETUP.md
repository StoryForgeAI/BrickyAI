# Starter credits — one-time, server-side entitlement

Every new Bricky AI account can receive a starting balance (currently **80
credits**). The grant is decided entirely by the **WordPress backend**; the
website only asks for it and then displays whatever balance the backend
returns. See `docs/WORDPRESS_AUTH_SETUP.md` for the overall architecture.

## How it works

1. Once a session is restored (or right after sign-in), the website calls
   `POST /api/credit/claim-starter` **once per signed-in account**.
2. The BFF route (`src/app/api/credit/claim-starter/route.ts`) forwards the
   browser's cookies to WordPress:
   `POST /wp-json/bricky/v1/credit/claim-starter` (authenticated with the
   session's Bearer token).
3. WordPress decides whether a grant is due, enforcing **one claim per account**
   and **one claim per browser environment** using its own HttpOnly
   `bricky_device_id` cookie (long-lived, survives logout).
4. The BFF returns `{ ok, granted, credits }`. The client never computes or
   grants credits itself.

There is no Supabase function, no `profiles` table, and no service key involved
anymore. The website holds no credit-writing capability: it cannot update a
balance — it can only read the backend's answer.

## Response shapes

- First claim: `200 { success: true, credits_added: 80, credits: 80, claim_id }`
- Already claimed (same account or same device):
  `{ success: false, code: "starter_already_claimed" }` — the BFF surfaces this
  as `{ ok: true, granted: false }`, which is a normal, expected outcome.

## Cookie

`bricky_device_id` is issued and owned by **WordPress** (HttpOnly,
`SameSite=Lax`, `Secure` in production). Because it lives on the WordPress
domain, the BFF must forward the incoming `Cookie` header on the claim request
and pass WordPress's `Set-Cookie` back to the browser. The client cannot read or
forge it.

## Expected behavior

- Account A signs in on a device → `granted: true`, 80 credits.
- Account A signs out, account B signs in on the same device → `granted: false`.
- Refreshing or restarting the browser → no second grant.
- Clearing all site data / switching browser or device may allow a new grant on
  that fresh environment — an accepted limitation of non-invasive anti-fraud.
