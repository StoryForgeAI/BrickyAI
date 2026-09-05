type DeleteAccountResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Requests deletion of the signed-in user's account and associated personal
 * data via the server-side account deletion route. The server validates the
 * access token, so the anon key is never able to delete anything.
 */
export async function deleteAccount(accessToken: string): Promise<DeleteAccountResult> {
  try {
    const res = await fetch("/api/account/delete", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
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