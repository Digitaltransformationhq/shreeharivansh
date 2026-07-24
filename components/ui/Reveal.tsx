"use client";

import { motion, type Variants } from "motion/react";

const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Reveal({
  children,
  i = 0,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  i?: number;
  className?: string;
  as?: "div" | "span" | "li" | "section";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      custom={i}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
