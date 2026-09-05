"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Check, Cpu } from "@/components/icons";

const EXAMPLES = [
  {
    id: "rounds",
    prompt: "Create a round system with 5 rounds to win.",
    fileName: "matchHandler.lua",
    code: [
      'local Players = game:GetService("Players")',
      'local ReplicatedStorage = game:GetService("ReplicatedStorage")',
      "",
      "-- Round state",
      "local match = {",
      "  currentRound = 1,",
      "  maxRounds = 5,",
      "  winners = {},",
      "}",
      "",
      "local function nextRound()",
      "  match.currentRound += 1",
      "  if match.currentRound > match.maxRounds then",
      '    print("Match complete!")',
      "  end",
      "end",
    ],
  },
  {
    id: "security",
    prompt: "Fix this RemoteEvent security issue.",
    fileName: "shopServer.lua",
    code: [
      'local ReplicatedStorage = game:GetService("ReplicatedStorage")',
      'local remote = ReplicatedStorage:WaitForChild("BuyItem")',
      "",
      "remote.OnServerEvent:Connect(function(player, itemId)",
      "  if not ValidateRequest(player, itemId) then return end",
      "  local item = GetShopCatalog(itemId)",
      "  if not item then return end",
      "",
      "  -- Server-owned purchase & grant",
      "  GrantItemTo(player, item)",
      "end)",
    ],
  },
  {
    id: "refactor",
    prompt: "Refactor this into modules.",
    fileName: "ShopService.lua",
    code: [
      "-- ModuleScript: ShopService",
      "local ShopService = {}",
      "",
      "function ShopService.Buy(player, itemId)",
      "  local item = ShopCatalog[itemId]",
      "  if item and ItemOwned(player, item) == false then",
      "    GrantItemTo(player, item)",
      "  end",
      "end",
      "",
      "return ShopService",
    ],
  },
];

function Highlight({ code }: { code: string }) {
  const tokens = code.split(
    /(--[^"]*|"[^"]*"|\blocal\b|\bfunction\b|\bif\b|\bthen\b|\bend\b|\bfor\b|\bin\b|\breturn\b|\btrue\b|\bfalse\b)/g
  );
  return (
    <>
      {tokens.map((tok, i) => {
        if (tok.startsWith("--")) {
          return (
            <span key={i} className="italic text-[var(--text-muted)]">
              {tok}
            </span>
          );
        }
        if (tok.startsWith('"')) {
          return (
            <span key={i} className="text-[#ffb48f]">
              {tok}
            </span>
          );
        }
        if (/^(local|function|if|then|end|for|in|return|true|false)$/.test(tok.trim())) {
          return (
            <span key={i} className="text-[var(--accent)]">
              {tok}
            </span>
          );
        }
        return <span key={i}>{tok}</span>;
      })}
    </>
  );
}

export default function AICoding() {
  const reduce = useReducedMotion();
  const { requireAuth } = useAuth();
  const [activeId, setActiveId] = useState(EXAMPLES[0].id);
  const active = EXAMPLES.find((e) => e.id === activeId)!;

  return (
    <section id="ai-coding" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScrollReveal direction="right">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-sm text-[var(--text-secondary)]">
              <Cpu className="h-4 w-4 text-[var(--accent)]" />
              AI Coding
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
              Stop staring at an empty Script.
            </h2>
            <p className="mt-5 leading-relaxed text-[var(--text-secondary)]">
              Ask for a feature, a fix, or a full system. Bricky AI plans,
              writes, and explains Luau — so you understand what ships into
              your game, not just what gets pasted in.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Luau generated & explained in plain language",
                "Systems done right: rounds, inventory, combat, economy",
                "Context-aware fixes — not blind rewrites",
                "Roblox APIs and data models at your fingertips",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[var(--text-secondary)]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-dim)] text-[var(--accent)]">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => requireAuth({ type: "navigate-download" })}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-[var(--accent)] px-7 text-[15px] font-semibold text-black transition-all duration-200 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_36px_var(--accent-glow)]"
              >
                Start Coding with AI
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-[var(--text-muted)]">
              Bricky AI works through structured commands and the Studio plugin
              — not arbitrary access to your machine.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.1}>
            {/* Prompt picker */}
            <div className="mb-4 flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => {
                const activePrompt = activeId === ex.id;
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => setActiveId(ex.id)}
                    aria-pressed={activePrompt}
                    className={`rounded-full border px-4 py-2 text-left font-mono text-xs transition-all duration-200 ${
                      activePrompt
                        ? "border-[var(--accent-border)] bg-[var(--accent-dim)] text-[var(--text-primary)]"
                        : "border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {ex.prompt}
                  </button>
                );
              })}
            </div>

            {/* Editor window */}
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[#0b0b0d] shadow-2xl">
              <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#3a3a42]" />
                <span className="h-3 w-3 rounded-full bg-[#3a3a42]" />
                <span className="h-3 w-3 rounded-full bg-[#3a3a42]" />
                <span className="ml-2 inline-flex items-center gap-1.5 font-mono text-xs text-[var(--text-secondary)]">
                  <Cpu className="h-3.5 w-3.5" /> {active.fileName}
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-dim)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--accent)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] pulse-dot" />
                  Generating
                </span>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="p-5"
                >
                  <div className="mb-4 flex justify-end">
                    <div className="max-w-[90%] rounded-2xl rounded-tr-sm bg-[var(--surface-raised)] px-4 py-2.5 font-mono text-[13px] text-[var(--text-primary)] ring-1 ring-[var(--accent-border)]">
                      {active.prompt}
                    </div>
                  </div>
                  <pre className="overflow-x-auto font-mono text-[13px] leading-7 text-[var(--text-primary)]">
                    {active.code.map((line, i) => (
                      <div key={i} className="whitespace-pre">
                        {line === "" ? "\u00A0" : <Highlight code={line} />}
                      </div>
                    ))}
                  </pre>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-4 py-3 text-[11px] text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                  Bricky AI
                </span>
                <span className="font-mono">
                  {active.id === "rounds" && "luau · round system"}
                  {active.id === "security" && "luau · server security"}
                  {active.id === "refactor" && "luau · module refactor"}
                </span>
                <span className={reduce ? "" : "caret"} />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}