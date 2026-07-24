import Label from "./ui/Label";
import Reveal from "./ui/Reveal";
import Stats from "./ui/Stats";

export default function About() {
  return (
    <section
      id="about"
      className="bg-bone px-6 pt-20 pb-16 sm:px-10 sm:pt-28 lg:px-16"
    >
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          <Reveal>
            <Label className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              About Us
            </Label>
          </Reveal>

          <div className="max-w-4xl">
            <Reveal i={1}>
              <h2 className="text-[clamp(1.9rem,4.2vw,3.4rem)] font-light leading-[1.1] tracking-tight text-ink">
                More than plots and structures, we build{" "}
                <span className="font-display italic text-accent">
                  communities that thrive
                </span>{" "}
                — master-planned estates and resort-style living where families
                put down roots and investments grow.
              </h2>
            </Reveal>
          </div>
        </div>

        {/* Stats */}
        <Stats />
      </div>
    </section>
  );
}
