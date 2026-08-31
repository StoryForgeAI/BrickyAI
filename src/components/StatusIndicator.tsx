"use client";

import { motion } from "motion/react";

type StatusTone = "accent" | "success" | "muted";

interface StatusIndicatorProps {
  label: string;
  tone?: StatusTone;
  /** Show an animated pulsing dot. */
  pulse?: boolean;
  className?: string;
}

const toneColor: Record<StatusTone, string> = {
  accent: "var(--accent)",
  success: "var(--success)",
  muted: "var(--text-muted)",
};

export default function StatusIndicator({
  label,
  tone = "accent",
  pulse = false,
  className = "",
}: StatusIndicatorProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--text-secondary)] ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <motion.span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75`}
            style={{ backgroundColor: toneColor[tone] }}
            animate={{ scale: [1, 2], opacity: [0.7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ backgroundColor: toneColor[tone] }}
        />
      </span>
      {label}
    </span>
  );
}
