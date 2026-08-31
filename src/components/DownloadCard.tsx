"use client";

import { motion, useReducedMotion } from "motion/react";
import { Windows, Download } from "@/components/icons";
import { WINDOWS_DOWNLOAD_URL } from "@/lib/config";

interface DownloadCardProps {
  platform: "windows";
  title?: string;
  subtitle?: string;
  meta?: string;
}

export default function DownloadCard({
  platform = "windows",
  title = "Bricky AI for Windows",
  subtitle = "The AI-powered Roblox Studio plugin developer.",
  meta = "Windows 10 / 11",
}: DownloadCardProps) {
  const reduce = useReducedMotion();
  const osForms = {
    windows: {
      icon: <Windows className="h-7 w-7" />,
      downloadLabel: "Download for Windows",
    },
  } as const;
  const form = osForms[platform];

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className="relative overflow-hidden rounded-3xl border border-[var(--accent-border)] bg-[var(--surface-raised)] p-7 text-center shadow-[0_30px_100px_-40px_var(--accent-glow)] sm:p-10"
    >
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-[var(--accent-dim)] blur-3xl" />

      <div className="relative">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-dim)] text-[var(--accent)] ring-1 ring-[var(--accent-border)]">
          {form.icon}
        </div>
        <h3 className="mt-5 text-2xl font-bold tracking-tight text-[var(--text-primary)]">{title}</h3>
        <p className="mx-auto mt-2 max-w-xs text-sm text-[var(--text-secondary)]">{subtitle}</p>

        <a
          href={WINDOWS_DOWNLOAD_URL}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 text-[15px] font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_40px_var(--accent-glow)] sm:w-auto"
          style={{ minHeight: "3.25rem" }}
        >
          <Download className="h-5 w-5" />
          {form.downloadLabel}
        </a>

        <div className="mt-4 text-xs text-[var(--text-muted)]">{meta}</div>
      </div>
    </motion.div>
  );
}
