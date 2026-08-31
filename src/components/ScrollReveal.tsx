"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Direction the element travels from while revealing. */
  direction?: Direction;
  /** Delay in seconds (used for stagger sequences). */
  delay?: number;
  /** Duration in seconds. */
  duration?: number;
  /** Distance in pixels. */
  distance?: number;
  /** Whether to animate once or every time it enters the viewport. */
  once?: boolean;
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

export default function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance,
  once = true,
}: ScrollRevealProps) {
  const reduce = useReducedMotion();
  const base = offsets[direction];
  const offset = distance ?? 24;
  const x = base.x === 0 ? 0 : (base.x > 0 ? offset : -offset);
  const y = base.y === 0 ? 0 : (base.y > 0 ? offset : -offset);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
