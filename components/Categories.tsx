import Image from "next/image";
import Reveal from "./ui/Reveal";
import PillArrowButton from "./ui/PillArrowButton";
import { categories } from "@/lib/data";

export default function Categories() {
  return (
    <section className="bg-bone-2 px-3 py-6 sm:px-4">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[28px] sm:rounded-[36px]">
        <div className="relative min-h-[520px] w-full sm:aspect-[16/8]">
          <Image
            src="/images/cat.jpg"
            alt="Project categories"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />

          <div className="relative z-10 flex h-full flex-col justify-end gap-8 p-6 sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:p-14">
            {/* Heading */}
            <Reveal>
              <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[0.92] tracking-tight text-bone">
                Project
                <span className="block font-display font-light italic">
                  Categories
                </span>
              </h2>
            </Reveal>

            {/* List + CTA */}
            <div className="flex flex-col gap-6 lg:items-end">
              <ul className="space-y-3">
                {categories.map((c, i) => (
                  <Reveal key={c} i={i}>
                    <li className="flex items-center gap-3 text-bone">
                      <span className="h-1.5 w-1.5 rounded-full bg-bone" />
                      <span className="text-[15px]">{c}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
              <Reveal i={4}>
                <PillArrowButton href="#contact" label="Contact us" />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
