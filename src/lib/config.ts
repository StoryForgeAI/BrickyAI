export const siteConfig = {
  name: "Bricky AI",
  tagline: "AI-powered Roblox Studio plugin development.",
  description:
    "Build and develop Roblox Studio plugins faster with Bricky AI, an AI-powered desktop development assistant.",
  url: "https://brickyai.com",
};

/**
 * Canonical site origin used for OAuth redirect targets.
 *
 * Production behaviour: set `NEXT_PUBLIC_SITE_URL` to the deployed Bricky AI
 * domain (e.g. `https://brickyai.com`) in the Vercel production environment so
 * Google OAuth deterministically returns to the production origin.
 *
 * Local development / previews: when the variable is unset, the origin of the
 * current page (`window.location.origin`) is used, so localhost keeps working.
 *
 * Never include a hardcoded localhost URL here — it must stay dynamic.
 */
export const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;

/**
 * Centralized download configuration.
 *
 * Defaults are placeholders ("#") on purpose — the actual installer and plugin
 * files do not exist yet, so the UI does not pretend they are live.
 *
 * To go live, either:
 *   1. Drop the files into `public/downloads/` and set the constants below to
 *      their public paths, or
 *   2. Set the corresponding NEXT_PUBLIC_* environment variable to your hosted
 *      URLs, or
 *   3. Edit the constants below directly.
 *
 * There is no need to touch any component — the whole site reads these values.
 */

/** Windows desktop application installer (BrickyAI-Setup.exe). */
export const WINDOWS_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL ?? "#";

/** Roblox Studio plugin file (BrickyAI.rbxmx) — placed in the local Plugins folder. */
export const PLUGIN_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_PLUGIN_DOWNLOAD_URL ?? "#";

/** Expected public paths once the real files are added to `public/downloads/`. */
export const DOWNLOAD_ASSETS = {
  windowsInstaller: "/downloads/BrickyAI-Setup.exe",
  plugin: "/downloads/BrickyAI.rbxmx",
} as const;

/** Local Roblox Studio Plugins directory (Windows). */
export const PLUGINS_FOLDER =
  "%LOCALAPPDATA%\\Roblox\\Plugins";

/** User-facing copy path shown in the installation helper. */
export const PLUGINS_FOLDER_EXAMPLE =
  "C:\\Users\\<YourUsername>\\AppData\\Local\\Roblox\\Plugins";

/** Optional deep-link for users who already have Bricky AI installed. */
export const LAUNCH_APP_URL = process.env.NEXT_PUBLIC_LAUNCH_APP_URL ?? "";
