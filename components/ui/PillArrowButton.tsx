"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// ============================================================
// PillArrowButton
//  • hover in  → arrow smoothly slides RIGHT and stays
//  • hover out → arrow smoothly slides back to its position
//  Renders as an <a> (next/link) when `href` is given, else a <button>.
//  `size` — "md" (default) or "sm" (compact, e.g. the navbar CTA).
// ============================================================

type PillArrowButtonProps = {
  label?: string;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
  size?: "md" | "sm";
};

export default function PillArrowButton({
  label = "View All",
  href,
  onClick,
  className = "",
  size = "md",
}: PillArrowButtonProps) {
  const [hovered, setHovered] = useState(false);
  const sm = size === "sm";

  const shell =
    "inline-flex cursor-pointer items-center rounded-full border-0 bg-neutral-900 p-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900" +
    (className ? ` ${className}` : "");

  const handlers = {
    onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  const inner = (
    <>
      {/* white pill — rounded on BOTH sides */}
      <span
        className={`flex items-center justify-center rounded-full font-medium text-neutral-900 ${
          sm ? "h-9 px-4 text-xs" : "h-11 px-6 text-sm"
        }`}
        style={{
          backgroundColor: hovered ? "#f4f4f4" : "#ffffff",
          transition: "background-color 200ms ease",
        }}
      >
        {label}
      </span>

      {/* black arrow cap — a circle the size of the pill, held 2px off the pill
          (ml-0.5) so the white pill keeps an even 2px frame all the way around. */}
      <span
        className={`ml-0.5 grid place-items-center rounded-full ${
          sm ? "h-9 w-8" : "h-11 w-9"
        }`}
      >
        <ChevronRight
          size={sm ? 15 : 18}
          strokeWidth={2.5}
          className="text-white"
          style={{
            transform: hovered ? "translateX(6px)" : "translateX(0px)",
            transition: "transform 300ms ease-out",
          }}
        />
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={shell} {...handlers}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={shell} {...handlers}>
      {inner}
    </button>
  );
}
