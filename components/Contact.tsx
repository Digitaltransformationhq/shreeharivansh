"use client";

import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import Reveal from "./ui/Reveal";

const PHONE_DISPLAY = "+91 63563 46862";
const PHONE_HREF = "tel:+916356346862";
const EMAIL = "shreeharivansh2555@gmail.com";
const ADDRESS =
  "'Radha Vatika', Chansad–Padra Main Road, Near Darshnam Kalrav, Darapura, Ta: Padra, Dist.: Vadodara – 391 440.";

type FormState = { name: string; phone: string; email: string; message: string };

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const set =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Enquiry — Radha Vatika${form.name ? ` (${form.name})` : ""}`;
    const body =
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\n${form.message}`.trim();
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const inputCls =
    "w-full rounded-lg border border-line bg-transparent px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-2/70 focus:border-accent";
  const labelCls = "mb-1.5 block text-[12px] uppercase tracking-wider text-ink-2";

  return (
    <section id="contact" className="bg-bone px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
      <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Left — heading + details */}
        <div>
          <Reveal>
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[0.95] tracking-tight text-ink">
              Get in
              <span className="block font-display font-light italic text-ink">
                Touch
              </span>
            </h2>
          </Reveal>

          <Reveal i={1}>
            <p className="mt-6 max-w-md text-[14px] leading-relaxed text-ink-2">
              Enquire about plots and resort ownership at Radha Vatika, or ask us
              anything about the project — we&apos;ll get right back to you.
            </p>
          </Reveal>

          <Reveal i={2}>
            <div className="mt-10 space-y-6">
              <a href={PHONE_HREF} className="group flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-bone">
                  <Phone size={18} />
                </span>
                <span>
                  <span className="block text-[12px] uppercase tracking-wider text-ink-2">
                    Call us
                  </span>
                  <span className="text-[15px] text-ink transition-colors group-hover:text-accent">
                    {PHONE_DISPLAY}
                  </span>
                </span>
              </a>

              <a href={`mailto:${EMAIL}`} className="group flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-bone">
                  <Mail size={18} />
                </span>
                <span>
                  <span className="block text-[12px] uppercase tracking-wider text-ink-2">
                    Email
                  </span>
                  <span className="break-all text-[15px] text-ink transition-colors group-hover:text-accent">
                    {EMAIL}
                  </span>
                </span>
              </a>

              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-bone">
                  <MapPin size={18} />
                </span>
                <span>
                  <span className="block text-[12px] uppercase tracking-wider text-ink-2">
                    Site address
                  </span>
                  <span className="block max-w-xs text-[15px] leading-relaxed text-ink">
                    {ADDRESS}
                  </span>
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right — enquiry form */}
        <Reveal i={1}>
          <form
            onSubmit={onSubmit}
            className="rounded-[22px] border border-line bg-paper p-6 shadow-[0_20px_45px_-30px_rgba(22,19,15,0.3)] sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={set("name")}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={set("phone")}
                  className={inputCls}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelCls}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                className={inputCls}
              />
            </div>
            <div className="mt-4">
              <label className={labelCls}>Message</label>
              <textarea
                rows={4}
                value={form.message}
                onChange={set("message")}
                placeholder="Tell us what you're looking for…"
                className={`${inputCls} resize-none`}
              />
            </div>
            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-ink px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-bone transition-colors hover:bg-accent"
            >
              Send Enquiry
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
