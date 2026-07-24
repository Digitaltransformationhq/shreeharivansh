"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

type ProjectCardProps = {
  img: string;
  title: string;
  location: string;
  status?: string;
  subtitle?: string;
  spec?: string;
  priceLabel?: string;
  price?: string;
  href?: string; // image / arrow-button link
  enquireHref?: string; // "Enquire now" link
  index?: number;
};

export default function ProjectCard({
  img,
  title,
  location,
  status,
  subtitle,
  spec,
  priceLabel,
  price,
  href = "#brochure",
  enquireHref = "#contact",
  index = 0,
}: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-[20px] border border-line bg-paper shadow-[0_20px_45px_-26px_rgba(22,19,15,0.4)]"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 440px"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />

        {status && (
          <span className="absolute left-4 top-4 rounded-md bg-paper/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-ink shadow-sm">
            {status}
          </span>
        )}

        <Link
          href={href}
          aria-label={`View ${title}`}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-ink/65 text-bone backdrop-blur-sm transition-colors hover:bg-ink"
        >
          <ArrowUpRight size={16} strokeWidth={2.2} />
        </Link>
      </div>

      {/* Body */}
      <div className="p-6">
        <h3 className="text-2xl font-medium tracking-tight text-ink">{title}</h3>
        {subtitle && <p className="mt-1 text-[14px] text-ink-2">{subtitle}</p>}

        {spec && (
          <span className="mt-4 inline-block rounded-md border border-line px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-ink">
            {spec}
          </span>
        )}

        <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.06em] text-accent">
          {location}
        </p>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-line pt-5">
          <div>
            {priceLabel && (
              <div className="text-[11px] uppercase tracking-[0.08em] text-ink-2">
                {priceLabel}
              </div>
            )}
            {price && (
              <div className="mt-0.5 text-lg font-medium text-ink">{price}</div>
            )}
          </div>

          <Link
            href={enquireHref}
            className="shrink-0 rounded-lg bg-accent px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-bone transition-colors hover:bg-[#a1552f]"
          >
            Enquire Now
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
