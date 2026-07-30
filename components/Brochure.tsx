import Label from "./ui/Label";
import Reveal from "./ui/Reveal";
import Flipbook from "./Flipbook";
import BrochureDownload from "./BrochureDownload";

export default function Brochure() {
  return (
    <section
      id="brochure"
      className="bg-bone-2 px-6 pb-20 pt-6 sm:px-10 sm:pb-28 sm:pt-8 lg:px-16"
    >
      <div className="mx-auto max-w-[1500px]">
        <Reveal>
          <Label className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            The Brochure
          </Label>
        </Reveal>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <Reveal i={1}>
            <h2 className="text-[clamp(1.9rem,4.2vw,3.4rem)] font-light leading-[1.1] tracking-tight text-ink">
              Explore{" "}
              <span className="font-display italic text-accent">Radha Vatika</span>
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="max-w-sm text-[14px] leading-relaxed text-ink-2">
              Flip through the full brochure — drag a page corner or click the
              edges to turn, just like a real book.
            </p>
          </Reveal>
        </div>

        <div className="mx-auto mt-14 w-full max-w-[720px]">
          <Flipbook />
        </div>

        <Reveal className="mt-10 flex justify-center">
          <BrochureDownload />
        </Reveal>
      </div>
    </section>
  );
}
