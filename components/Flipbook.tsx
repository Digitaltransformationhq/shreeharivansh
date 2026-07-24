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
  const portraitRef = useRef(false);

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
  portraitRef.current = portrait;
  // On mobile: page fills the container (single page). On desktop: a spread.
  const minW = portrait ? w : 260;
  const maxW = portrait ? w : BASE_W;

  // On desktop the book is two pages wide, but the cover and the final page are
  // shown alone — on the right and left halves respectively — so the book reads
  // off-centre. Slide it half a page (25% of its two-page width) so the visible
  // page stays centred, and let it glide back to the middle for the two-page
  // spreads in between. Set the transform inline: react-pageflip owns the
  // element's className, and its stylesheet already puts a transform on it, so a
  // CSS class of ours would be both clobbered and out-specified. Portrait shows
  // one full page, so it never shifts.
  const bookRef = useRef<{ pageFlip?: () => { getCurrentPageIndex?: () => number } }>(null);
  const pageRef = useRef(0);
  const dirRef = useRef(1); // last flip direction: 1 = forward, -1 = back
  const position = (p: number, animate = true) => {
    const parent = wrapRef.current?.querySelector<HTMLElement>(".stf__parent");
    if (!parent) return;
    let tx = "0%";
    if (!portraitRef.current) {
      if (p <= 0) tx = "-25%";
      else if (p >= PAGES.length - 1) tx = "25%";
    }
    parent.style.transition = animate
      ? "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)"
      : "none";
    parent.style.transform = `translateX(${tx})`;
  };

  // Where a flip that starts at page `f` in direction `dirRef` will land. The
  // cover (0) and last page are lone leaves; every spread in between advances or
  // retreats two pages. We only need the target to know its shift, so any middle
  // value maps to "centred".
  const targetOf = (f: number) => {
    const last = PAGES.length - 1;
    if (f <= 0) return 1; // cover → can only open forward
    if (f >= last) return last - 2; // last page → can only close back
    if (dirRef.current === 1) return f + 2; // forward; f+2 === last on the final spread
    return f === 1 ? 0 : f - 2; // back; f === 1 is the spread against the cover
  };

  // onFlip only fires once a turn *completes*, which would make the book slide
  // after the page has already flipped. Kick the slide off the instant the turn
  // begins (onChangeState → "flipping") using the predicted destination, so the
  // shift and the page-turn move together. On settle ("read") re-sync to the real
  // page, which also corrects a drag that was released and snapped back.
  const onState = (state: string) => {
    if (portraitRef.current) return;
    if (state === "flipping") {
      position(targetOf(pageRef.current));
    } else if (state === "read") {
      const idx = bookRef.current?.pageFlip?.()?.getCurrentPageIndex?.();
      if (typeof idx === "number") {
        pageRef.current = idx;
        position(idx);
      }
    }
  };

  // Which side of the book was pressed decides the flip direction — page-flip
  // turns forward from the right, back from the left — so read it on pointer down,
  // before the turn starts.
  const onPointerDown = (e: React.PointerEvent) => {
    const parent = wrapRef.current?.querySelector<HTMLElement>(".stf__parent");
    if (!parent) return;
    const r = parent.getBoundingClientRect();
    dirRef.current = e.clientX >= r.left + r.width / 2 ? 1 : -1;
  };

  return (
    <div ref={wrapRef} className="w-full" onPointerDown={onPointerDown}>
      {w === 0 ? (
        <div className="mx-auto aspect-[1387/1950] w-[350px] max-w-full animate-pulse rounded-lg bg-bone-2" />
      ) : (
        // @ts-expect-error — react-pageflip's prop types are loose
        <HTMLFlipBook
          ref={bookRef}
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
          onInit={() => {
            pageRef.current = 0;
            position(0, false);
          }}
          onFlip={(e: { data: number }) => {
            pageRef.current = e.data;
            position(e.data);
          }}
          onChangeState={(e: { data: string }) => onState(e.data)}
          onChangeOrientation={() => {
            pageRef.current = 0;
            position(0, false);
          }}
          className="flipbook mx-auto"
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
