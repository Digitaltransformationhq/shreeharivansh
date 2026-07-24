import Reveal from "./ui/Reveal";
import PillArrowButton from "./ui/PillArrowButton";
import ProjectCard from "./ui/ProjectCard";
import { recentProjects } from "@/lib/data";

export default function RecentProjects() {
  return (
    <section
      id="projects"
      className="bg-bone px-6 pb-24 pt-8 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-[1500px]">
        {/* Heading row */}
        <div className="grid items-end gap-8 border-t border-line pt-12 lg:grid-cols-[1fr_1.1fr_auto]">
          <Reveal>
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[0.95] tracking-tight text-ink">
              Recent
              <span className="block font-display font-light italic text-ink">
                Projects
              </span>
            </h2>
          </Reveal>

          <Reveal i={1}>
            <p className="max-w-md text-[14px] leading-relaxed text-ink-2">
              Radha Vatika — our flagship pre-lease plotted township and resort.
              A gated community built around grand arrivals, lush greenery, and
              resort-style living, where every plot is an investment in a
              lifestyle.
            </p>
          </Reveal>

          <Reveal i={2}>
            <div className="justify-self-start lg:justify-self-end">
              <PillArrowButton href="#projects" label="View All" />
            </div>
          </Reveal>
        </div>

        {/* Single featured project */}
        <div className="mt-14 max-w-md">
          {recentProjects.map((p, i) => (
            <ProjectCard key={p.title} {...p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
