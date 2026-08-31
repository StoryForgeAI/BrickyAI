"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import ScrollReveal from "@/components/ScrollReveal";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index?: number;
}

export default function FeatureCard({ icon, title, description, index = 0 }: FeatureCardProps) {
  const reduce = useReducedMotion();
  return (
    <ScrollReveal delay={index * 0.06} className="h-full">
      <motion.article
        whileHover={reduce ? undefined : { y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="group relative h-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 transition-colors duration-300 hover:border-[var(--accent-border)]"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--accent-dim)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--accent)] transition-colors duration-300 group-hover:border-[var(--accent-border)] group-hover:bg-[var(--accent-dim)]">
            {icon}
          </div>
          <h3 className="mt-5 text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
        </div>
      </motion.article>
    </ScrollReveal>
  );
}
