import ScrollReveal from "@/components/ScrollReveal";
import FeatureCard from "@/components/FeatureCard";
import {
  Cpu,
  GitBranch,
  Layers,
  Lock,
  Message,
  Plug,
  Sparkles,
  Folder,
} from "@/components/icons";

const FEATURES = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI Plugin Creation",
    description:
      "Describe the plugin you want and let Bricky AI help design its architecture.",
  },
  {
    icon: <Plug className="h-5 w-5" />,
    title: "Roblox Studio Integration",
    description:
      "Work directly with Roblox Studio through the Bricky AI plugin.",
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    title: "Multiple AI Providers",
    description:
      "Connect supported AI providers and choose which model powers your chat.",
  },
  {
    icon: <Folder className="h-5 w-5" />,
    title: "Project Memory",
    description:
      "Keep conversations organized into projects and continue where you left off.",
  },
  {
    icon: <GitBranch className="h-5 w-5" />,
    title: "Command System",
    description:
      "Bricky AI uses a structured command system instead of arbitrary Lua execution.",
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: "Local Development",
    description:
      "Development communication happens through your local Bricky AI environment.",
  },
  {
    icon: <Layers className="h-5 w-5" />,
    title: "Live Progress",
    description: "See what Bricky AI is doing while it works.",
  },
  {
    icon: <Message className="h-5 w-5" />,
    title: "Plugin Workflow",
    description: "Go from an idea to a working Roblox Studio plugin faster.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
            Features
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Built for plugin development.
          </h2>
          <p className="mt-4 text-[var(--text-secondary)]">
            Everything you need to go from a vague idea to a working plugin in
            Roblox Studio — powered by AI, kept local.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} index={i} />
          ))}
          <ScrollReveal
            delay={FEATURES.length * 0.06}
            className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] p-6 text-center text-sm text-[var(--text-muted)]"
          >
            More capabilities are on the way.
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
