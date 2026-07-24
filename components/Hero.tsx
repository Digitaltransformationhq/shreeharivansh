"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { heroSlides } from "@/lib/data";
import PillArrowButton from "./ui/PillArrowButton";

export default function Hero() {
  const [index, setIndex] = useState(0);
  const slide = heroSlides[index];

  const go = useCallback((i: number) => {
    setIndex((i + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const t = setInterval(() => go(index + 1), 6000);
    return () => clearInterval(t);
  }, [index, go]);

  return (
    <section className="relative">
      <div className="relative overflow-hidden">
        {/* Slides */}
        <div className="relative h-screen min-h-[620px] w-full">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={slide.img}
                alt={slide.caption.heading}
                fill
                priority
                sizes="100vw"
                className={`object-cover ${slide.posMobile ?? ""}`}
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradients for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 to-transparent" />

          {/* Content */}
          <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-center px-6 pb-10 pt-28 sm:px-10 sm:pb-14 lg:px-16">
            {/* Headline + caption row */}
            <div className="flex -translate-y-20 flex-col gap-8 sm:-translate-y-8 lg:flex-row lg:items-end lg:justify-between">
              {/* Big title */}
              <div>
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={index}
                    className="font-light leading-[0.86] text-bone"
                  >
                    {slide.title.map((word, wi) => (
                      <motion.span
                        key={word + wi}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          delay: wi * 0.12,
                          duration: 0.7,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={
                          wi === 1
                            ? "block font-display text-[16vw] italic sm:text-[13vw] lg:text-[150px]"
                            : "block text-[15vw] font-medium tracking-tight sm:text-[12vw] lg:text-[140px]"
                        }
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.h1>
                </AnimatePresence>

                {/* Enquire — mobile only (desktop has it in the navbar) */}
                <div className="mt-7 lg:hidden">
                  <PillArrowButton href="#contact" label="Enquire" />
                </div>
              </div>
            </div>
          </div>

          {/* Curved bone island rising into the bottom of the hero — matches the
              nav island (600px wide, 70px flare × 60px tall), centered.
              Single path, so there are no seams between the curves and the middle. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] flex justify-center">
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

          {/* Slider dots — slim, centered inside the bump */}
          <div className="absolute bottom-[17px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full bg-ink transition-all duration-500 ease-out ${
                  i === index
                    ? "w-6 opacity-90"
                    : "w-1.5 opacity-30 hover:opacity-60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
