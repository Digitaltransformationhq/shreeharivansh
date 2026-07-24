"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import PillArrowButton from "./ui/PillArrowButton";

const links = [
  { label: "About Us", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Brochure", href: "#brochure" },
  { label: "Contact", href: "#contact" },
];

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

          <button
            aria-label="Menu"
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-full bg-bone/15 backdrop-blur lg:hidden"
          >
            <div className="space-y-[5px]">
              <span className="block h-[2px] w-5 bg-bone" />
              <span className="block h-[2px] w-5 bg-bone" />
            </div>
          </button>
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
              {links.map((l) => (
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

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-rust-deep/98 backdrop-blur lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span className="text-lg font-semibold text-bone">SHREE</span>
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full bg-bone/10 text-bone"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-2 px-6 pt-8">
              {links.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-bone/10 py-4 font-display text-4xl italic text-bone"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-8">
                <PillArrowButton href="#contact" label="Enquire" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
