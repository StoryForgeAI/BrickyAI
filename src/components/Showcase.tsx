"use client";

import { useReducedMotion } from "motion/react";
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { Check, Folder, Message, Plug, Logo } from "@/components/icons";

function WindowFrame({ title, children, accent }: { title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
        accent ? "border-[var(--accent-border)]" : "border-[var(--border)]"
      } bg-[var(--surface-raised)] shadow-[0_20px_70px_-30px_rgba(0,0,0,0.8)]`}
    >
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a42]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a42]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#3a3a42]" />
        <span className="ml-2 inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <Logo className="h-3.5 w-3.5" />
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

export default function Showcase() {
  const reduce = useReducedMotion();
  const [activeProject, setActiveProject] = useState("Toolbar Shortcuts");

  const projects = ["Toolbar Shortcuts", "Part Painter", "Export Helper"];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
            The workspace
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Meet the workspace.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            One focused place to plan, build, and manage your plugins alongside
            Roblox Studio.
          </p>
        </ScrollReveal>

        {/* Row 1: dashboard + projects */}
        <div className="mt-16 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <ScrollReveal direction="right">
            <WindowFrame title="Dashboard">
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    Welcome back 👋
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-dim)] px-2.5 py-1 text-[11px] font-medium text-[var(--accent)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] pulse-dot" />
                    Studio Connected
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[["Plugins", "3 active"], ["Projects", "2"], ["Connections", "1"]].map(([k, v]) => (
                    <div key={k} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                      <div className="text-2xl font-bold text-[var(--text-primary)]">{v}</div>
                      <div className="mt-1 text-xs text-[var(--text-muted)]">{k}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    <Message className="h-4 w-4" /> Recent activity
                  </div>
                  <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                      Generated Toolbar Shortcuts plugin
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]" />
                      Updated Part Painter
                    </div>
                  </div>
                </div>
              </div>
            </WindowFrame>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.1}>
            <WindowFrame title="Projects">
              <div className="space-y-2 p-5">
                {projects.map((p) => {
                  const active = activeProject === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setActiveProject(p)}
                      aria-pressed={active}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 ${
                        active
                          ? "border-[var(--accent-border)] bg-[var(--accent-dim)] text-[var(--text-primary)]"
                          : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                      }`}
                    >
                      <Folder className="h-4 w-4 text-[var(--accent)]" />
                      <span className="flex-1">{p}</span>
                      {active && <Check className="h-4 w-4 text-[var(--accent)]" />}
                    </button>
                  );
                })}
              </div>
            </WindowFrame>
          </ScrollReveal>
        </div>

        {/* Row 2: chat + connection */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.3fr]">
          <ScrollReveal direction="right">
            <WindowFrame title="New Chat">
              <div className="space-y-4 p-5">
                <div className="flex gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-[var(--surface-hover)] text-[var(--accent)] flex items-center justify-center">
                    <Message className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-secondary)]">
                    Let&apos;s build a toolbar plugin that inserts a smoothed part.
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="rounded-2xl rounded-tr-sm bg-[var(--accent-dim)] px-4 py-2.5 text-sm text-[var(--text-primary)] ring-1 ring-[var(--accent-border)]">
                    On it. I&apos;ll plan the structure first…
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-muted)]">
                  <span className={reduce ? "" : "caret"} />
                  Type a message or describe a plugin
                </div>
              </div>
            </WindowFrame>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.1}>
            <WindowFrame title="Studio Connection" accent>
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                  <span className="text-sm text-[var(--text-secondary)]">Roblox Studio</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--success)]">
                    <Plug className="h-4 w-4" />
                    Connected
                  </span>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Active Plugin
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-dim)] text-[var(--accent)]">
                      <Logo className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--text-primary)]">
                        Toolbar Shortcuts
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">Loaded in Studio</div>
                    </div>
                  </div>
                </div>
              </div>
            </WindowFrame>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
