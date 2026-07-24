"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import PillArrowButton from "./ui/PillArrowButton";
import { navLinks } from "@/lib/data";

// Centered white "island" geometry — full-width flat top that narrows toward
// the bottom with smooth convex curves, so the image shows in the bottom corners.
const IW = 600; // island width (top, widest)
const IH = 44; // island height
const FLARE = 95; // how far each bottom corner is inset from the top edge

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 top-0 z-50"
    >
      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-12">
        {/* Logo (left) + CTA/hamburger (right), over the image */}
        <div className="flex h-[78px] items-center justify-between">
          <Link href="#" className="text-bone drop-shadow">
            <span className="font-script text-[32px] leading-none">
              Shree Harivansh
            </span>
          </Link>

          <div className="hidden lg:block">
            <PillArrowButton href="#contact" label="Enquire" />
          </div>
        </div>

        {/* Centered white island (desktop) */}
        <div className="pointer-events-none absolute left-1/2 top-0 hidden -translate-x-1/2 lg:block">
          <div className="relative" style={{ width: IW, height: IH }}>
            <svg
              width={IW}
              height={IH}
              viewBox={`0 0 ${IW} ${IH}`}
              fill="var(--paper)"
              style={{ filter: "drop-shadow(0 12px 22px rgba(0,0,0,0.18))" }}
              aria-hidden
            >
              <path
                d={`M ${FLARE} ${IH} H ${IW - FLARE} C ${IW - FLARE / 2} ${IH} ${IW - FLARE / 2} 0 ${IW} 0 L 0 0 C ${FLARE / 2} 0 ${FLARE / 2} ${IH} ${FLARE} ${IH} Z`}
              />
            </svg>
            {/* Links overlaid on the island */}
            <nav className="pointer-events-auto absolute inset-0 flex items-center justify-center gap-2">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="rounded-full px-4 py-1.5 text-[13.5px] font-medium text-ink/75 transition-colors hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu toggle — the two bars rotate into an X in place, and it
          stays above the overlay so its position never shifts. */}
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className={`absolute right-6 top-[17px] z-[70] grid h-11 w-11 place-items-center rounded-full backdrop-blur lg:hidden ${
          open ? "bg-ink/10" : "bg-bone/15"
        }`}
      >
        <span className="relative block h-4 w-5">
          <motion.span
            className={`absolute left-0 top-[7px] block h-[2px] w-5 rounded-full ${
              open ? "bg-ink" : "bg-bone"
            }`}
            initial={false}
            animate={{ y: open ? 0 : -4, rotate: open ? 45 : 0 }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.span
            className={`absolute left-0 top-[7px] block h-[2px] w-5 rounded-full ${
              open ? "bg-ink" : "bg-bone"
            }`}
            initial={false}
            animate={{ y: open ? 0 : 4, rotate: open ? -45 : 0 }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
          />
        </span>
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-bone/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center px-6 py-6">
              <span className="text-lg font-semibold text-ink">SHREE</span>
            </div>
            <div className="flex flex-col gap-2 px-6 pt-8">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-ink/10 py-4 font-display text-4xl italic text-ink"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
