# Google OAuth / "Continue with Google" setup

Bricky AI signs users in through Supabase Auth. To offer "Continue with
Google" you need to enable the Google provider in Suapbase **and** create the
matching OAuth client in the Google Cloud Console. Both must agree on the
redirect URL and the site domain, otherwise Google (and/or Supabase) will
reject the sign-in.

## 1. Supabase side

1. Open your project on https://supabase.com → **Authentication → Providers**.
2. Enable the **Google** provider.
3. In the **Authorized redirect URIs** list, copy the generated URL — it looks
   like:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
   You will paste this exact value into Google Cloud below.

## 2. Google Cloud Console

1. Go to https://console.cloud.google.com and create or open the project that
   will own the OAuth client (it does **not** have to be your Supabase
   project).
2. **APIs & Services → OAuth consent screen** and configure:
   - User type: **External** (or Internal if this is a private tool).
   - Application name: `Bricky AI`.
   - Add your email as the support email.
   - **Publish the app** (until published, only listed test users can sign in).
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**,
   type **Web application**:
   - **Authorized JavaScript origins:** add
     - `https://brickyai.com`
     - `http://localhost:3000` (for local testing)
   - **Authorized redirect URIs:** add the Supabase callback from step 1
     (`https://<your-project-ref>.supabase.co/auth/v1/callback`).
4. Copy the **Client ID** and **Client secret**.

## 3. Back in Supabase

1. **Authentication → Providers → Google**, paste the **Client ID** and
   **Client secret**.
2. Save. The Google provider is now live.

## 4. Local testing

- Run the site with `.env.local` containing `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Supabase reads the redirect target from the request: the site passes
  `redirectTo` (see `AuthModal.tsx`) so the user lands back on the page they
  came from.
- Make sure `http://localhost:3000` is in the Google client's authorized
  origins and that you are listed as a test user (or the app is published).

## 5. Common problems

- **`redirect_uri_mismatch`** → the Supabase callback URL in Google does not
  exactly match the one Supabase shows.
- **`access blocked`** → the OAuth consent screen is not published, or your
  Google account is not a test user.
- **Login works but the account menu shows an unknown user** → check that
  Supabase and the site use the same project (same `anon` key) and that no
  second `createClient` was introduced.
- **`error=access_denied` on return** → the user cancelled the Google prompt
  or the consent screen rejected the request; the site shows a friendly
  message rather than a crash.