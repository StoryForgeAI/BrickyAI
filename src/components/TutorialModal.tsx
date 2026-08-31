"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { Check, Close, Plug } from "@/components/icons";

const STEPS = [
  { title: "Download the Bricky AI plugin", desc: "Grab the Roblox Studio plugin from the Bricky AI app." },
  { title: "Close Roblox Studio and Bricky AI", desc: "A clean start makes plugin installation smoother." },
  { title: "Open Bricky AI", desc: "Launch the desktop app and let it prepare the connection." },
  { title: "Open Roblox Studio", desc: "Start Studio with the Bricky AI plugin available." },
  { title: "Enable the Bricky AI plugin", desc: "Turn on the plugin in Studio's Plugins menu." },
  { title: "And build!", desc: "Describe a plugin and watch Bricky AI help bring it to life." },
];

interface TutorialModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TutorialModal({ open, onClose }: TutorialModalProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="How to install the plugin"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-[var(--border-subtle)] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-dim)] text-[var(--accent)]">
                  <Plug className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Connect Bricky AI to Roblox Studio
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">How to install the plugin</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
              >
                <Close className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-5">
              {STEPS.map((step, i) => {
                const isLast = i === STEPS.length - 1;
                return (
                  <motion.div
                    key={step.title}
                    initial={reduce ? false : { opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className={`flex gap-4 ${
                      isLast
                        ? "rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-dim)] p-4"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold ${
                          isLast
                            ? "bg-[var(--accent)] text-black"
                            : "border border-[var(--border-strong)] text-[var(--text-secondary)]"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {!isLast && <span className="mt-1 w-px flex-1 bg-[var(--border)]" />}
                    </div>
                    <div className="pb-6">
                      <div
                        className={`font-medium ${
                          isLast ? "text-lg text-[var(--accent)]" : "text-[var(--text-primary)]"
                        }`}
                      >
                        {step.title}
                      </div>
                      {!isLast && (
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">{step.desc}</p>
                      )}
                      {isLast && (
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          You&apos;re set. {step.desc}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="border-t border-[var(--border-subtle)] px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)]"
              >
                <Check className="h-4 w-4" />
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
