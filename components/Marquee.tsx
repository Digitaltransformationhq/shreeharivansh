const items = [
  "Architecture",
  "Interior Design",
  "Construction",
  "Landscape",
  "Urban Planning",
  "Restoration",
];

export default function Marquee() {
  return (
    <div className="marquee-pause overflow-hidden border-y border-bone/10 bg-rust py-5">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
            {items.map((it) => (
              <div key={it + dup} className="flex items-center">
                <span className="px-8 font-display text-2xl italic text-bone/80">
                  {it}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
