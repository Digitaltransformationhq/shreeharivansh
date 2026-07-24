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

      {/* Oversized wordmark — spans the footer, flush to the bottom */}
      <div className="select-none px-3 pt-10 sm:px-5">
        <span className="block whitespace-nowrap text-[12.6vw] font-medium leading-[0.72] tracking-[-0.02em] text-bone">
          Shree Harivansh
        </span>
      </div>
    </footer>
  );
}
