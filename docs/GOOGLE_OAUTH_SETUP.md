# Google OAuth / "Continue with Google" setup

Bricky AI signs users in through Supabase Auth. Sign-in is **Google-only** —
the site has no email/password, signup, or password-reset UI, so you should
**disable the Email provider** in Supabase (Authentication → Providers → Email)
and remove it from the Google consent screen, leaving Google as the sole
provider. To offer "Continue with Google" you need to enable the Google
provider in Supabase **and** create the matching OAuth client in the Google
Cloud Console. Both must agree on the redirect URL and the site domain,
otherwise Google (and/or Supabase) will reject the sign-in.

The site never hardcodes a redirect origin. It builds the post-auth redirect
from `NEXT_PUBLIC_SITE_URL` when set (production), otherwise from the current
page origin (`window.location.origin`), which keeps `localhost` working for
local development and Vercel preview URLs working automatically.

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

## 4. Production redirect configuration

To make login return to the Bricky AI production domain (never a leftover
`localhost:3000` from development):

1. In Vercel (**Project → Settings → Environment Variables**) set
   `NEXT_PUBLIC_SITE_URL` to your deployed domain, e.g. `https://brickyai.com`,
   scoped to the **Production** environment. Leave it unset for Local/Preview
   so those use the current origin.
2. In Vercel, also set `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and server-only `SUPABASE_SECRET_KEY`.
3. In Supabase → **Authentication → URL Configuration**, make sure the
   **Site URL** is the production domain (e.g. `https://brickyai.com`) and the
   **Redirect URLs** list includes it. A stale `http://localhost:3000` Site URL
   is the classic cause of production logins rebounding to localhost when
   `redirectTo` is ever missing.
4. Redeploy the site after changing environment variables.

## 5. Local testing

- Run the site with `.env.local` containing `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Supabase reads the redirect target from the request: the site passes
  `redirectTo` (see `AuthModal.tsx`) so the user lands back on the page they
  came from.
- Make sure `http://localhost:3000` is in the Google client's authorized
  origins and that you are listed as a test user (or the app is published).

## 6. Common problems

- **Login always lands on `http://localhost:3000` in production** → the login
  was started from a localhost origin, or Supabase's **Site URL** /
  **Redirect URLs** still contain `http://localhost:3000`. Set
  `NEXT_PUBLIC_SITE_URL` to the production domain in Vercel and fix the
  Supabase URL Configuration (see [section 4](#4-production-redirect-configuration)).
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

## 7. Session behavior and account records

- Sessions are persisted by the Supabase browser client (PKCE flow). A user who
  signs in once stays signed in across visits until the session expires; the
  site restores it and only shows the sign-in window when a feature needs
  authentication and no valid session exists.
- Logging out (sign-out button) calls `supabase.auth.signOut()`, which revokes
  the session both server- and client-side, so returning to the site does not
  silently restore a previous session.
- Account records live in the `auth.users` table. A per-user row in the
  `profiles` table is created **inside the database** (a trigger on
  `auth.users`); the website only ever reads `profiles`, never writes it, so
  duplicate or incomplete profile rows are not created from the client.

## 8. Recommended `profiles` trigger (idempotent)

The profile row must exist exactly once per user. If you already created the
table and trigger, make sure the insert is **idempotent** so a race between
the trigger and any concurrent code can never create duplicates or fail the
sign-in. **Do not set `credits` in the trigger** — the starter credit balance
is granted exclusively by the server-side claim function (see
`docs/CREDITS_SETUP.md`), so the trigger inserts `id` and `email` only and
leaves `credits` at `NULL` (an account with a `NULL` balance receives **80**
starting credits on its first server-validated claim). Recommended SQL (run
once in the Supabase SQL editor):

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  subscription text,
  credits numeric,
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

Keep `enforce_row_level_security` enabled on `profiles` and give users only
`select` privileges on their own row; the `security definer` trigger must have
`insert` privileges.