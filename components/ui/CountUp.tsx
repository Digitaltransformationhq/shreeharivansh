"use client";

import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

// Counts from 0 up to the numeric part of `value` once `start` is true,
// preserving any suffix (e.g. the "+" in "180+").
export default function CountUp({
  value,
  start,
  duration = 1.8,
}: {
  value: string;
  start: boolean;
  duration?: number;
}) {
  const match = /^(\d+)(.*)$/.exec(value.trim());
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  const count = useMotionValue(0);
  const text = useTransform(count, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!start) return;
    const controls = animate(count, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [start, target, duration, count]);

  if (!match) return <span>{value}</span>;
  return <motion.span>{text}</motion.span>;
}
