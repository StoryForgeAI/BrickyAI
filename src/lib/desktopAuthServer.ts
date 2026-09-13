import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Server-only helpers for the desktop-app authentication handshake.
 *
 * This module imports `node:crypto` and is guarded with `server-only`, so it
 * can never be bundled into client code. The raw device secret is generated
 * and hashed here and only the hash is ever stored; the secret itself is
 * returned to the desktop app exactly once.
 */

/** Public identifier for an in-flight desktop sign-in request (~128 bits). */
export function generateDesktopRequestId(): string {
  return randomBytes(16).toString("base64url");
}

/** Opaque secret held by the desktop app (~256 bits). Never stored raw. */
export function generateDesktopSecret(): string {
  return randomBytes(32).toString("base64url");
}

/** SHA-256 hex digest used as the stored form of the device secret. */
export function hashDesktopSecret(secret: string): string {
  return createHash("sha256").update(secret, "utf8").digest("hex");
}

/** Constant-time comparison of two digests (timingSafeEqual). */
export function secretDigestsEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length || bufA.length === 0) return false;
  return timingSafeEqual(bufA, bufB);
}