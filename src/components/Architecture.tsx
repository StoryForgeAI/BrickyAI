"use client";

import { motion, useReducedMotion } from "motion/react";
import ScrollReveal from "@/components/ScrollReveal";
import { Layers, Logo, Plug, Server } from "@/components/icons";

export default function Architecture() {
  const reduce = useReducedMotion();

  const nodes = [
    {
      icon: <Logo className="h-5 w-5" />,
      title: "Bricky AI Desktop App",
      tag: "Your workspace",
    },
    {
      icon: <Server className="h-5 w-5" />,
      title: "Local Server",
      tag: "Authenticated local API",
    },
    {
      icon: <Plug className="h-5 w-5" />,
      title: "Roblox Studio Plugin",
      tag: "Connected to Studio",
    },
  ];

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
            Architecture
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Your AI, connected to Studio.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            Bricky AI sits between your AI assistant and Roblox Studio through a
            secure, local pipeline.
          </p>
        </ScrollReveal>

        <div className="mt-16">
          {nodes.map((node, i) => (
            <div key={node.title}>
              <ScrollReveal direction="up" delay={i * 0.1}>
                <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 transition-colors hover:border-[var(--accent-border)]">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--accent)]">
                    {node.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-[var(--text-primary)]">
                      {node.title}
                    </div>
                    <div className="text-sm text-[var(--text-muted)]">{node.tag}</div>
                  </div>
                </div>
              </ScrollReveal>
              {i < nodes.length - 1 && <ConnectionLine reduce={reduce} />}
            </div>
          ))}

          <ScrollReveal delay={0.2}>
            <div className="mt-4 flex items-center gap-4 rounded-2xl border border-dashed border-[var(--border-strong)] p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--text-secondary)]">
                <Layers className="h-5 w-5" />
              </div>
              <div className="text-sm text-[var(--text-muted)]">
                A structured command system connects the AI to Studio — no
                arbitrary Lua execution.
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function ConnectionLine({ reduce }: { reduce: boolean | null }) {
  return (
    <div className="relative mx-auto flex h-16 w-8 items-center justify-center">
      {reduce ? (
        <div className="h-px w-6 bg-[var(--border-strong)]" />
      ) : (
        <motion.div
          className="relative w-px"
          initial={{ height: 8, opacity: 0 }}
          whileInView={{ height: 40, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-[var(--border-strong)]" />
          <motion.div
            className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[var(--accent)]"
            animate={{ top: ["8%", "88%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </div>
  );
}
