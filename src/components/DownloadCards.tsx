"use client";

import { motion, useReducedMotion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import type { AuthPendingAction } from "@/context/AuthContext";
import { Windows, Plug, Download } from "@/components/icons";
import { WINDOWS_DOWNLOAD_URL, PLUGIN_DOWNLOAD_URL } from "@/lib/config";

function AnimatedDownloadIcon() {
  const reduce = useReducedMotion();
  return (
    <span className="relative inline-flex h-5 w-5">
      <Download className="h-5 w-5" />
      {!reduce && (
        <motion.span
          className="absolute inset-0 flex items-start justify-center"
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <Download className="h-5 w-5 text-white/70" />
        </motion.span>
      )}
    </span>
  );
}

interface DownloadCardProps {
  icon: React.ReactNode;
  badge: string;
  title: string;
  description: string;
  meta: React.ReactNode;
  fileLabel: string;
  note: string;
  href: string;
  accent?: boolean;
  /** Deferred action to run once the user authenticates (when logged out). */
  pendingAction: AuthPendingAction;
}

function Card({ icon, badge, title, description, meta, fileLabel, note, href, accent, pendingAction }: DownloadCardProps) {
  const reduce = useReducedMotion();
  const { user, configured, requireAuth } = useAuth();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // When authentication is configured and the user is signed out, require
    // sign-in before the download starts.
    if (configured && !user) {
      e.preventDefault();
      e.stopPropagation();
      requireAuth(pendingAction);
    }
  };

  const needsAuth = configured && !user;

  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={`relative flex h-full flex-col overflow-hidden rounded-3xl border bg-[var(--surface-raised)] p-7 transition-colors duration-300 sm:p-9 ${
        accent ? "border-[var(--accent-border)]" : "border-[var(--border)] hover:border-[var(--accent-border)]"
      }`}
    >
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-[var(--accent-dim)] blur-3xl" />

      <div className="relative flex flex-1 flex-col">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] pulse-dot" />
          {badge}
        </span>

        <div className="mt-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)] ring-1 ring-[var(--accent-border)]">
          {icon}
        </div>

        <h3 className="mt-5 text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
          {meta}
        </div>

        <div className="mt-6">
          <a
            href={href}
            onClick={handleClick}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
              accent
                ? "bg-[var(--accent)] text-black hover:bg-[var(--accent-strong)] hover:shadow-[0_0_40px_var(--accent-glow)]"
                : "border border-[var(--accent-border)] bg-[var(--accent-dim)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black hover:shadow-[0_0_40px_var(--accent-glow)]"
            }`}
          >
            <AnimatedDownloadIcon />
            {needsAuth ? "Sign in to download" : fileLabel}
          </a>
        </div>

        <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
          {needsAuth ? "Sign in with Google or email to continue." : note}
        </p>
      </div>
    </motion.article>
  );
}

export default function DownloadCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card
        icon={<Windows className="h-7 w-7" />}
        badge="Desktop Application"
        title="Bricky AI for Windows"
        description="Download the Bricky AI desktop application for Windows."
        meta={
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1">
              <Windows className="h-3.5 w-3.5 text-[var(--accent)]" /> Windows
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1">
              Windows 10 / Windows 11
            </span>
          </>
        }
        fileLabel="Download for Windows"
        note="Windows installer"
        href={WINDOWS_DOWNLOAD_URL}
        pendingAction={{ type: "download-windows" }}
        accent
      />

      <Card
        icon={<Plug className="h-7 w-7" />}
        badge="Roblox Studio Plugin"
        title="Bricky AI Roblox Studio Plugin"
        description="Connect Bricky AI to Roblox Studio using the official Bricky AI plugin."
        meta={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1">
            <Plug className="h-3.5 w-3.5 text-[var(--accent)]" /> .rbxmx plugin
          </span>
        }
        fileLabel="Download Plugin"
        note="Roblox Studio plugin"
        href={PLUGIN_DOWNLOAD_URL}
        pendingAction={{ type: "download-plugin" }}
      />
    </div>
  );
}
