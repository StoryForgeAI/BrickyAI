# "Continue with Google" setup (WordPress + Nextend Social Login)

Google sign-in is handled by the WordPress backend, not the website. The
website only starts the flow and receives the one-time `code` back. See
`docs/WORDPRESS_AUTH_SETUP.md` for the full architecture.

## Flow

1. The user clicks **Continue with Google**. The browser performs a **full-page
   navigation** to
   `{NEXT_PUBLIC_BRICKY_API_URL}/wp-json/bricky/v1/auth/google/start`
   (via `startGoogleFlow()` in `src/lib/social-auth.ts`). This must never be a
   `fetch`, because WordPress sets a short-lived flow cookie (10 min).
2. WordPress/Nextend sends the user to Google and back.
3. WordPress redirects to `{BRICKY_FRONTEND_URL}/auth/google/callback?code=…`
   (the code is valid for 5 minutes).
4. `/auth/google/callback` calls `POST /api/auth/google/exchange` with the code.
5. WordPress responds by **setting an HttpOnly `bricky_access_token` cookie** —
   it does *not* return the JWT in the JSON body. The BFF captures that value
   from the upstream `Set-Cookie` and re-issues it as the website's own
   `bricky_session` cookie. The browser never sees the JWT.
6. The deferred post-sign-in action (if any) runs and the user is returned to
   the page they started from.

## WordPress configuration

- Plugin `bricky-ai-api` v1.4.0 must be active (provides
  `/auth/google/start` and `/auth/google/exchange`).
- Nextend Social Login must be configured with a **Google** provider whose
  redirect URI points at the WordPress callback.
- Define `BRICKY_FRONTEND_URL` in `wp-config.php` as the deployed site origin
  (e.g. `https://bricky-ai.vercel.app`) so the `code` is delivered back to the
  website. If it is missing, WordPress returns the code to itself and the
  website never receives it.
- In the Google Cloud Console, add the WordPress callback as an **Authorized
  redirect URI** and the site origin as an **Authorized JavaScript origin**.

## Facebook

There is currently **no** Facebook provider/endpoint on the backend. The UI
still shows a "Continue with Facebook" button (product requirement); clicking it
shows an honest "not available just yet" notice. This is tracked as a required
backend change — it is never faked. See `SOCIAL_PROVIDERS` in
`src/lib/social-auth.ts`.

## Local testing

1. Ensure `NEXT_PUBLIC_BRICKY_API_URL=http://localhost/wordpress` in
   `.env.local`.
2. Set `BRICKY_FRONTEND_URL=http://localhost:3000` (or your dev port) in
   `wp-config.php` and add `http://localhost:3000` to the Google client.
3. Run `npm run dev`, open `/login`, click **Continue with Google**.

## Troubleshooting

- **Back on the site but not signed in** → `BRICKY_FRONTEND_URL` is unset or
  wrong, or the `code` expired (>5 min).
- **`redirect_uri_mismatch`** → the redirect URI in Google does not exactly
  match the WordPress/Nextend callback.
- **Exchange returns a configuration error** → WordPress did not set the
  `bricky_access_token` cookie on the exchange response. Verify the exchange
  handler in the `bricky-ai-api` plugin.
