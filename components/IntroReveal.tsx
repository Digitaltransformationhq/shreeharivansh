"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { navLinks } from "@/lib/data";

// Navbar island geometry — identical to Navbar.tsx so the curtain edge
// matches the real bar exactly.
const IW = 600;
const IH = 44;
const FLARE = 95;
const NAV_PATH = `M ${FLARE} ${IH} H ${IW - FLARE} C ${IW - FLARE / 2} ${IH} ${
  IW - FLARE / 2
} 0 ${IW} 0 L 0 0 C ${FLARE / 2} 0 ${FLARE / 2} ${IH} ${FLARE} ${IH} Z`;

// ============================================================
// IntroReveal — page-load curtain.
//  Two bone panels cover the screen. The top panel's lower edge is the
//  navbar island; the bottom panel's upper edge is the hero bottom bar.
//  On load they retract to the top and bottom — carrying those bars back
//  to their real positions — then unmount so the real page takes over.
// ============================================================
export default function IntroReveal() {
  const [done, setDone] = useState(false);
  if (done) return null;

  const ease = [0.83, 0, 0.17, 1] as const;
  const transition = { duration: 1.15, ease, delay: 0.25 };

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {/* TOP curtain — retracts up, carrying the navbar island to the top. */}
      <motion.div
        className="absolute inset-x-0 top-0 bg-bone"
        initial={{ height: "56vh" }}
        animate={{ height: 0 }}
        transition={transition}
      >
        <div className="absolute left-1/2 top-full -translate-x-1/2">
          <div className="relative" style={{ width: IW, height: IH }}>
            <svg
              width={IW}
              height={IH}
              viewBox={`0 0 ${IW} ${IH}`}
              fill="var(--paper)"
              style={{ filter: "drop-shadow(0 12px 22px rgba(0,0,0,0.18))" }}
              aria-hidden
            >
              <path d={NAV_PATH} />
            </svg>
            {/* mirror the real nav links so the handoff is seamless */}
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              {navLinks.map((l) => (
                <span
                  key={l.label}
                  className="px-4 py-1.5 text-[13.5px] font-medium text-ink/75"
                >
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* BOTTOM curtain — retracts down, carrying the bottom bar to the bottom. */}
      <motion.div
        className="absolute inset-x-0 bottom-0 bg-bone"
        initial={{ height: "56vh" }}
        animate={{ height: 0 }}
        transition={transition}
        onAnimationComplete={() => setDone(true)}
      >
        <div className="absolute inset-x-0 bottom-full flex justify-center">
          <svg
            className="h-[40px] w-[640px] max-w-full"
            viewBox="0 0 640 40"
            preserveAspectRatio="none"
            fill="var(--bone)"
            aria-hidden
          >
            <path d="M100 0 H540 C590 0 590 40 640 40 L0 40 C50 40 50 0 100 0 Z" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
