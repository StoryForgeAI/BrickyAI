# Subscriptions — current status

**Status: read-only. There is no purchase, cancel, or promo flow in the
website.**

Subscriptions are owned by the WordPress backend. The website only displays the
subscription snapshot that `GET /wp-json/bricky/v1/account` returns inside
`account.subscription`:

```json
{
  "plan": "free",
  "status": "active",
  "started_at": null,
  "current_period_start": null,
  "current_period_end": null,
  "next_weekly_grant_at": null,
  "canceled_at": null
}
```

## What was removed

The former Supabase test-billing system was deleted entirely:

- `src/lib/subscription.ts`, `src/lib/dashboard.ts`
- `src/app/api/subscription/*`, `src/app/api/dashboard`, `src/app/api/promo/*`
- `supabase/migrations/20260917000000_subscriptions_and_weekly_credits.sql`
- the test-checkout modal and `purchaseTestSubscription()`

## What exists now

| Piece | Location | Purpose |
| --- | --- | --- |
| Plan definitions | `src/lib/plans.ts` | Prices/features copy for the marketing page only. |
| Pricing page | `src/app/pricing/page.tsx`, `src/components/pricing/PricingCards.tsx`, `PricingFaq.tsx` | Marketing copy. Signed-in users are sent to `/dashboard`; signed-out users are asked to sign in first. No checkout. |
| Dashboard | `src/app/dashboard/page.tsx`, `src/components/dashboard/DashboardPage.tsx` | Read-only: plan, status, member since, credit balance, period dates when the backend provides them. |
| Account API | `src/app/api/account` → `GET /bricky/v1/account` | The only source of subscription data. |

## Required backend change (when billing is ready)

Purchasing/cancelling/promos need new `bricky/v1` endpoints (e.g.
`subscription/purchase`, `subscription/cancel`, `promo/redeem`) and a real
payment processor. Until then the website intentionally offers no way to change
a plan, and no payment information is collected.

## Weekly credits

The weekly credit schedule is a backend concern. The website never computes or
writes balances; it displays `account.credits` and, when the backend supplies
it, `subscription.next_weekly_grant_at`.
