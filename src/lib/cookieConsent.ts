/**
 * Client-side cookie / consent preference handling.
 *
 * Only used to remember a visitor's choice about optional storage. The record
 * intentionally contains no personal data beyond the choice itself (version,
 * accepted/rejected categories, and a timestamp). Authentication state is
 * managed separately by Supabase Auth's own session storage — this module
 * never touches tokens or sessions.
 */

export const CONSENT_STORAGE_KEY = "bricky-consent";
export const CONSENT_VERSION = 1;

export type ConsentCategories = {
  /** Always active — session/auth handling, security, core site behavior. */
  necessary: true;
  /** Optional — remembering preferences such as your chosen settings (default off). */
  preferences: boolean;
};

export interface ConsentRecord {
  version: number;
  categories: ConsentCategories;
  /** ISO timestamp of when the visitor made this choice. */
  timestamp: string;
}

export function createConsentRecord(categories: ConsentCategories): ConsentRecord {
  return {
    version: CONSENT_VERSION,
    categories,
    timestamp: new Date().toISOString(),
  };
}

/** A record with everything optional rejected — used before any explicit choice. */
export function defaultConsentRecord(): ConsentRecord {
  return createConsentRecord({ necessary: true, preferences: false });
}

export function readStoredConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (!parsed || parsed.version !== CONSENT_VERSION || !parsed.categories) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredConsent(record: ConsentRecord): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage unavailable (private browsing / disabled) — the banner will
    // simply reappear on the next visit, which is acceptable fallback.
  }
}