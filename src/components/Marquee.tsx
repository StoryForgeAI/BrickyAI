const TERMS = [
  "create_plugin",
  "AI Chat",
  "Roblox Studio",
  "Local Server",
  "Claude",
  "ChatGPT",
  "Project Memory",
  "Command System",
  "Plugin Workflow",
  "Secure Connection",
  "Live Progress",
  "Toolbar Actions",
];

export default function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-[var(--border-subtle)] bg-black/40 py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--background)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--background)] to-transparent" />
      <div className="marquee flex w-max items-center gap-8">
        {[...TERMS, ...TERMS].map((term, i) => (
          <span
            key={`${term}-${i}`}
            className="font-mono text-sm text-[var(--text-muted)]"
          >
            <span className="mr-8 text-[var(--accent)]">▍</span>
            {term}
          </span>
        ))}
      </div>
    </div>
  );
}
