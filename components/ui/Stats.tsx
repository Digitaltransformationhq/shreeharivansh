"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { stats } from "@/lib/data";
import Reveal from "./Reveal";
import CountUp from "./CountUp";

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  // fires once the stats block is at least 25% visible
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <div
      ref={ref}
      className="mt-16 grid grid-cols-2 justify-items-center gap-8 border-t border-line pt-10 text-center lg:grid-cols-4"
    >
      {stats.map((s, i) => (
        <Reveal key={s.label} i={i}>
          <div>
            <div className="font-display text-5xl font-light text-ink">
              <CountUp value={s.value} start={inView} />
            </div>
            <div className="mt-2 text-[13px] text-ink-2">{s.label}</div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
