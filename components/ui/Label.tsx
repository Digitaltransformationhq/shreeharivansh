export default function Label({
  children,
  className = "",
  tone = "dark",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  const color = tone === "dark" ? "text-ink-2" : "text-bone/70";
  const dot = tone === "dark" ? "bg-accent" : "bg-bone";
  return (
    <div
      className={`flex items-center gap-2.5 text-[13px] font-medium tracking-[0.02em] ${color} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {children}
    </div>
  );
}
