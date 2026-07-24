"use client";

import { motion } from "motion/react";
import Link from "next/link";

type Variant = "dark" | "light" | "ghost" | "outline";

// SOLID pill body with a nested circle ("pill inside pill") holding the arrow.
const styles: Record<Variant, { pill: string; chip: string }> = {
  // dark → for light backgrounds
  dark: { pill: "bg-ink text-bone", chip: "bg-bone text-ink" },
  // light / ghost → for dark or image backgrounds
  light: {
    pill: "bg-bone text-ink",
    chip: "bg-paper text-ink ring-1 ring-ink/10",
  },
  ghost: {
    pill: "bg-bone text-ink",
    chip: "bg-paper text-ink ring-1 ring-ink/10",
  },
  // outline → white pill with a hairline ring and a solid black arrow chip
  outline: {
    pill: "bg-paper text-ink ring-1 ring-ink/25",
    chip: "bg-ink text-bone",
  },
};

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M4.5 2l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PillButton({
  children,
  href = "#",
  variant = "dark",
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
}) {
  const s = styles[variant];
  return (
    <motion.div
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      className={`inline-flex ${className}`}
    >
      <Link
        href={href}
        className={`group inline-flex h-11 items-center rounded-full pl-6 pr-1.5 ${s.pill}`}
      >
        <span className="pr-3.5 text-[13px] font-medium tracking-wide">
          {children}
        </span>
        {/* Nested arrow circle */}
        <span
          className={`relative grid h-9 w-9 place-items-center overflow-hidden rounded-full ${s.chip}`}
        >
          <motion.span
            className="absolute"
            variants={{ hover: { x: 20, opacity: 0 } }}
            transition={{ duration: 0.32, ease: [0.65, 0, 0.35, 1] }}
          >
            <Chevron />
          </motion.span>
          <motion.span
            className="absolute"
            initial={{ x: -20, opacity: 0 }}
            variants={{ hover: { x: 0, opacity: 1 } }}
            transition={{ duration: 0.32, ease: [0.65, 0, 0.35, 1] }}
          >
            <Chevron />
          </motion.span>
        </span>
      </Link>
    </motion.div>
  );
}
