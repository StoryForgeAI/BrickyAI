export const siteConfig = {
  name: "Bricky AI",
  tagline: "AI-powered Roblox Studio plugin development.",
  description:
    "Build and develop Roblox Studio plugins faster with Bricky AI, an AI-powered desktop development assistant.",
  url: "https://brickyai.com",
};

/**
 * Centralized download configuration.
 *
 * To wire up the real installer, either:
 *   1) Drop `BrickyAI-Setup.exe` into `public/downloads/` (leave the path as-is), or
 *   2) Change `WINDOWS_DOWNLOAD_URL` below to your hosted installer path/URL,
 *      or set `NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL` as an environment variable.
 */
export const WINDOWS_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL ?? "/downloads/BrickyAI-Setup.exe";

/** Optional deep-link for users who already have Bricky AI installed. */
export const LAUNCH_APP_URL = process.env.NEXT_PUBLIC_LAUNCH_APP_URL ?? "";
