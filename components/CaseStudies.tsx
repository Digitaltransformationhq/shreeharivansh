import Image from "next/image";
import Label from "./ui/Label";
import Reveal from "./ui/Reveal";
import PillArrowButton from "./ui/PillArrowButton";
import { caseStudies } from "@/lib/data";

export default function CaseStudies() {
  return (
    <section
      id="case-studies"
      className="bg-gradient-to-b from-bone-2 to-bone px-6 py-20 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <Label>Recent case studies</Label>
        </Reveal>

        <div className="mt-6">
          {caseStudies.map((c, i) => (
            <Reveal key={c.title} i={i}>
              <article className="grid items-center gap-6 border-t border-line py-10 last:border-b sm:grid-cols-[1.2fr_1fr] sm:gap-12">
                {/* Text */}
                <div className="order-2 sm:order-1">
                  <h3 className="text-2xl font-medium text-ink sm:text-3xl">
                    {c.title}
                  </h3>
                  <p className="mt-4 max-w-md text-[14px] leading-relaxed text-ink-2">
                    {c.body}
                  </p>
                  <div className="mt-7">
                    <PillArrowButton href="#contact" label="View more" />
                  </div>
                </div>

                {/* Image */}
                <div className="group order-1 overflow-hidden rounded-[22px] sm:order-2">
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={c.img}
                      alt={c.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
