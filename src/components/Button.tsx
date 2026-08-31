import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface ButtonProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Open the link in a new tab. */
  external?: boolean;
  /** Anchor-specific attributes. */
  anchorProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] text-black hover:bg-[var(--accent-strong)] hover:shadow-[0_0_28px_var(--accent-glow)]",
  secondary:
    "border border-[var(--border-strong)] bg-[var(--surface-raised)] text-[var(--text-primary)] hover:border-[var(--accent-border)] hover:text-[var(--accent)]",
  ghost:
    "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-transparent",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-[15px]",
};

export default function Button(props: ButtonProps) {
  const { href, variant = "primary", size = "md", className = "", children, external, anchorProps } =
    props;

  const base = `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 select-none ${variants[variant]} ${sizes[size]} ${className}`;

  if (external || anchorProps) {
    return (
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={base} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={base} scroll={false}>
      {children}
    </Link>
  );
}
