type DeleteAccountResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Requests deletion of the signed-in user's account via the server-side route.
 * The HttpOnly session cookie authenticates the request, so the browser never
 * sends or stores a token. The current backend has no deletion endpoint yet, so
 * this yields a clean, user-presentable "not available" status until it does.
 */
export async function deleteAccount(): Promise<DeleteAccountResult> {
  try {
    const res = await fetch("/api/account/delete", { method: "POST" });
    if (res.ok) return { ok: true };
    let message = "Something went wrong while deleting your account.";
    try {
      const body = (await res.json()) as { error?: string };
      if (typeof body.error === "string" && body.error) message = body.error;
    } catch {
      /* fall back to generic message */
    }
    return { ok: false, error: message };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}