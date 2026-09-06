"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import ProductMockup from "@/components/ProductMockup";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Sparkles } from "@/components/icons";

export default function Hero() {
  const reduce = useReducedMotion();
  const { requireAuth } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.2]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div style={{ y: reduce ? 0 : bgY }} className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,120,71,0.10),transparent_55%)]" />
        </motion.div>
        <motion.div style={{ opacity: glowOpacity }} className="absolute inset-0">
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        </motion.div>
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Badge */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-6 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-sm text-[var(--text-secondary)]">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)] pulse-dot" />
            Your AI Development Assistant for Roblox
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease }}
          className="mx-auto max-w-4xl text-center text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
        >
          <span className="text-[var(--text-primary)]">Build Roblox.</span>
          <br />
          <span className="bg-gradient-to-r from-[var(--accent)] to-[#ffb48f] bg-clip-text text-transparent">
            Faster.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-[var(--text-secondary)] sm:text-xl"
        >
          Bricky AI helps you build, code, debug, and create Roblox Studio
          plugins with AI — without getting stuck on the technical stuff.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button
            type="button"
            onClick={() => requireAuth({ type: "navigate-download" })}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 text-[15px] font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_40px_var(--accent-glow)] sm:w-auto"
          >
            Start Building
            <ArrowRight className="h-4 w-4" />
          </button>
          <a
            href="#plugins"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface-raised)] px-7 text-[15px] font-medium text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent-border)] hover:text-[var(--accent)] sm:w-auto"
          >
            <Sparkles className="h-4 w-4" />
            Create a Plugin
          </a>
        </motion.div>

        {/* Status micro details */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--text-muted)]"
        >
          {["Roblox Studio Connected", "AI Ready", "Local Development", "Secure Connection"].map(
            (s, i) => (
              <span key={s} className="inline-flex items-center gap-1.5">
                {i > 0 && <span className="mx-1 h-1 w-1 rounded-full bg-[var(--border-strong)]" />}
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  {s}
                </span>
              </span>
            )
          )}
        </motion.div>

        {/* Product preview */}
        <div className="relative mx-auto mt-14 max-w-3xl">
          <div className="pointer-events-none absolute -inset-x-8 -top-10 -bottom-16 -z-10 rounded-[40px] bg-[radial-gradient(ellipse_at_center,rgba(255,120,71,0.12),transparent_70%)] blur-2xl" />
          <ProductMockup />
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-2 gap-y-2 font-mono text-xs text-[var(--text-muted)]"
          >
            {["Describe", "Build", "Test in Studio", "Improve"].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-md border border-[var(--border)] bg-[var(--surface-raised)] px-2.5 py-1">
                  {step}
                </span>
                {i < arr.length - 1 && <span className="text-[var(--accent)]">→</span>}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}