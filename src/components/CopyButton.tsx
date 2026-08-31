"use client";

import { useRef, useState } from "react";
import { Check } from "@/components/icons";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({ text, label = "Copy", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-hover)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--accent-border)] hover:text-[var(--accent)] ${
        copied ? "border-[var(--success)] !text-[var(--success)]" : ""
      } ${className}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : null}
      {copied ? "Copied" : label}
    </button>
  );
}
