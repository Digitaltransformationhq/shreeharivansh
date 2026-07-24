import Image from "next/image";
import Label from "./ui/Label";
import Reveal from "./ui/Reveal";
import { architects } from "@/lib/data";

export default function Architects() {
  return (
    <section className="bg-gradient-to-b from-bone to-bone-2 px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <Label>Our Architects</Label>
        </Reveal>

        <div className="mt-8">
          {architects.map((a, i) => (
            <Reveal key={a.name} i={i}>
              <a
                href="#contact"
                className="group grid grid-cols-[1fr_auto] items-center gap-4 border-t border-line py-6 transition-colors last:border-b hover:bg-paper/40 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)_auto] sm:gap-8 sm:px-4"
              >
                {/* Name + optional photo */}
                <div className="flex items-center gap-4">
                  {a.photo ? (
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={a.photo}
                        alt={a.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span className="hidden h-12 w-12 shrink-0 sm:block" />
                  )}
                  <span className="text-lg font-medium text-ink transition-colors group-hover:text-accent">
                    {a.name}
                  </span>
                </div>

                {/* Note */}
                <p className="hidden max-w-sm text-[13px] leading-relaxed text-ink-2 sm:flex sm:items-start sm:gap-2">
                  <span className="mt-1 text-accent">✳</span>
                  {a.note}
                </p>

                {/* Link */}
                <span className="flex items-center gap-2 justify-self-end text-[13px] font-medium text-ink-2 transition-colors group-hover:text-ink">
                  View Profile
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path
                      d="M1 7h11M7 2l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
