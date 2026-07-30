import Link from "next/link";

const footerLinks = [
  {
    title: "Explore",
    items: [
      { label: "About Us", href: "#about" },
      { label: "Projects", href: "#projects" },
      { label: "Brochure", href: "#brochure" },
    ],
  },
  {
    title: "Connect",
    items: [
      { label: "Contact", href: "#contact" },
      { label: "Instagram", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-rust pt-16">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-16">
        {/* Link columns */}
        <div className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Link href="#" className="text-bone">
              <span className="font-script text-[40px] leading-none">
                Shree Harivansh
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-bone/60">
              Architecture & construction studio. Building beyond structure —
              the art and science of designing the spaces people live in.
            </p>
          </div>
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-semibold uppercase tracking-wider text-bone/50">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.items.map((it) => (
                  <li key={it.label}>
                    <Link
                      href={it.href}
                      className="text-[14px] text-bone/75 transition-colors hover:text-bone"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-bone/10 pt-8 text-[12.5px] text-bone/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Shree Harivansh. All rights reserved.</p>
        </div>
      </div>

      {/* Oversized wordmark — spans the footer edge to edge, flush to the
          bottom. Drawn as SVG text rather than a font-size in vw: `textLength`
          pins the width to the viewBox exactly, so it always fills the footer
          regardless of how Fraunces italic actually measures. `lengthAdjust`
          is "spacing", so only the letter gaps flex — glyphs are never
          stretched. The viewBox is cropped to the baseline; "Shree Harivansh"
          has no descenders, so the letters sit flush to the bottom edge. */}
      <div className="select-none pt-10">
        <svg
          viewBox="0 0 710 82"
          className="block h-auto w-full text-bone"
          role="img"
          aria-label="Shree Harivansh"
        >
          <text
            x="0"
            y="78"
            textLength="710"
            lengthAdjust="spacing"
            fill="currentColor"
            fontSize="100"
            className="font-display font-light italic"
          >
            Shree Harivansh
          </text>
        </svg>
      </div>
    </footer>
  );
}
