# Desktop application sign-in — current status

**Status: not enabled on the backend yet.**

The website ships the desktop sign-in UI and server routes, but the WordPress
`bricky-ai-api` plugin does not expose desktop-binding endpoints. Until it
does, the flow fails fast with a clean, honest message (`desktop_not_enabled`,
HTTP 501) — it is never faked.

## What exists in the website today

| Route | Behavior |
| --- | --- |
| `POST /api/auth/desktop/start` | Proxies to the expected WordPress `auth/desktop/start`; on 404 returns `{ code: "desktop_not_enabled" }`, 501. |
| `POST /api/auth/desktop/complete` | Requires the website session cookie; proxies to the expected WordPress `auth/desktop/complete`. |
| `POST /api/auth/desktop/exchange` | Proxies to the expected WordPress `auth/desktop/exchange` so a desktop app can redeem a one-time code. |
| `/auth/desktop` page (`DesktopAuthClient`) | Starts the WordPress **Google** flow, then calls `complete` with the website session. |

## What the backend must add (required change)

The plugin must implement the three `auth/desktop/*` endpoints with this
contract (mirrored by the BFF proxies):

- `start` → `{ request_id, device_secret, expires_in, redirect_url }`
  (`device_secret` is returned exactly once and never placed in a URL).
- `complete` `{ requestId }` (authenticated via the WordPress JWT) → binds the
  request to the user; `200 { ok: true }`.
- `exchange` `{ requestId, deviceSecret }` → `202 { status: "pending" }` until
  bound, then `200 { status: "authenticated", account: { … } }`; single-use and
  short-lived (10 minutes).

Once the plugin implements these, the website routes work without changes.
