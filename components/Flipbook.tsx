"use client";

import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

const PAGES = Array.from({ length: 8 }, (_, i) => `/brochure/page-${i + 1}.jpg`);
const PW = 1387;
const PH = 1950;
// A sensible base page size at the pages' aspect.
const BASE_W = 350;
const BASE_H = Math.round((BASE_W * PH) / PW);

export default function Flipbook() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  // Measure the real available width so we can force a single full-width page
  // on mobile (react-pageflip's own width detection is unreliable here).
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setW(Math.round(el.clientWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const portrait = w > 0 && w < 640;
  // On mobile: page fills the container (single page). On desktop: a spread.
  const minW = portrait ? w : 260;
  const maxW = portrait ? w : BASE_W;

  return (
    <div ref={wrapRef} className="w-full">
      {w === 0 ? (
        <div className="mx-auto aspect-[1387/1950] w-[350px] max-w-full animate-pulse rounded-lg bg-bone-2" />
      ) : (
        // @ts-expect-error — react-pageflip's prop types are loose
        <HTMLFlipBook
          key={portrait ? "portrait" : "landscape"}
          width={BASE_W}
          height={BASE_H}
          size="stretch"
          minWidth={minW}
          maxWidth={maxW}
          minHeight={Math.round((minW * PH) / PW)}
          maxHeight={Math.round((maxW * PH) / PW)}
          usePortrait
          drawShadow
          maxShadowOpacity={0.4}
          showCover
          mobileScrollSupport
          className="mx-auto shadow-2xl"
        >
          {PAGES.map((src, i) => (
            <div key={i} className="h-full w-full bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Radha Vatika brochure — page ${i + 1}`}
                className="block h-full w-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </HTMLFlipBook>
      )}
    </div>
  );
}
