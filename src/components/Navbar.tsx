"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { deleteAccount } from "@/lib/account";
import { subscriptionLabel, creditsLabel } from "@/lib/profile";
import { Close, Download, Logo, Menu, Spinner, User } from "@/components/icons";

const NAV_LINKS = [
  { label: "Product", href: "/#product" },
  { label: "Plugins", href: "/#plugins" },
  { label: "Pricing", href: "/#pricing" },
];

const SECTION_IDS = ["product", "plugins", "pricing"];

function shortEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const trimmed = name.length > 14 ? `${name.slice(0, 12)}…` : name;
  return `${trimmed}@${domain}`;
}

function AccountMenu({ onNavigate }: { onNavigate: () => void }) {
  const { user, session, loading, signOut, configured, requireAuth, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  if (loading) {
    return (
      <button
        type="button"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border)] px-4 text-sm text-[var(--text-secondary)]"
        aria-label="Loading account"
      >
        <Spinner className="h-4 w-4 animate-spin" />
      </button>
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => {
          requireAuth({ type: "navigate-download" });
          onNavigate();
        }}
        className="inline-flex h-10 items-center rounded-full border border-[var(--border-strong)] px-5 text-sm font-medium text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
      >
        Log in
      </button>
    );
  }

  const handleDelete = async () => {
    if (!configured || !session) return;
    setDeleting(true);
    setDeleteError(null);
    const result = await deleteAccount(session.access_token);
    setDeleting(false);
    if (result.ok) {
      setOpen(false);
      void signOut();
    } else {
      setDeleteError(result.error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex h-10 max-w-[220px] items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] px-3 text-sm text-[var(--text-primary)] transition-colors hover:border-[var(--accent-border)]"
      >
        <User className="h-4 w-4 text-[var(--accent)]" />
        <span className="truncate">{shortEmail(user.email ?? "Account")}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-2xl"
          >
            <div className="border-b border-[var(--border-subtle)] px-4 py-3">
              <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                {user.email}
              </p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                {(profile?.email_verified ?? false) || user.email_confirmed_at
                  ? "Email verified via Google"
                  : "Connected with Google"}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-[var(--surface)] px-3 py-2">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    Subscription
                  </p>
                  <p className="mt-0.5 truncate text-xs font-medium text-[var(--text-primary)]">
                    {subscriptionLabel(profile)}
                  </p>
                </div>
                <div className="rounded-lg bg-[var(--surface)] px-3 py-2">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    Credits
                  </p>
                  <p className="mt-0.5 truncate text-xs font-medium text-[var(--text-primary)]">
                    {creditsLabel(profile)}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <p className="px-3 pb-1 pt-1.5 text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
                Account
              </p>
              {confirmingDelete ? (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                  <p className="text-xs leading-relaxed text-red-300">
                    This permanently deletes your account and associated personal
                    data (some records may be retained where legally required).
                    This cannot be undone.
                  </p>
                  {deleteError && (
                    <p className="mt-2 text-xs text-red-300">{deleteError}</p>
                  )}
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={handleDelete}
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                    >
                      {deleting ? "Deleting…" : "Delete account"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(false)}
                      className="inline-flex flex-1 items-center justify-center rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      void signOut();
                      setOpen(false);
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]"
                  >
                    Sign out
                  </button>
                  {configured && (
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(true)}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      Delete account
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { requireAuth } = useAuth();

  const handleDownload = () => {
    setOpen(false);
    requireAuth({ type: "navigate-download" });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-[var(--border-subtle)] bg-black/70 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md text-[17px] font-semibold tracking-tight"
        >
          <Logo className="h-7 w-7" />
          <span className="text-[var(--text-primary)]">
            Bricky <span className="text-[var(--accent)]">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === "/" && active === link.href.replace("/#", "");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <AccountMenu onNavigate={() => setOpen(false)} />
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-medium text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_24px_var(--accent-glow)]"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)] md:hidden"
        >
          {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-[var(--border-subtle)] bg-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-5">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-3 flex flex-col gap-2"
              >
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] text-sm font-medium text-black transition-colors hover:bg-[var(--accent-strong)]"
                >
                  <Download className="h-4 w-4" />
                  Download Bricky AI
                </button>
                <div className="rounded-xl border border-[var(--border)] p-2">
                  <AccountMenu onNavigate={() => setOpen(false)} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}