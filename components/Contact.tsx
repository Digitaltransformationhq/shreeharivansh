"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import Reveal from "./ui/Reveal";

const PHONE_DISPLAY = "+91 63563 46862";
const PHONE_HREF = "tel:+916356346862";
const EMAIL = "shreeharivansh2555@gmail.com";
const ADDRESS =
  "'Radha Vatika', Chansad–Padra Main Road, Near Darshnam Kalrav, Darapura, Ta: Padra, Dist.: Vadodara – 391 440.";

/** Google Maps listing for the site — opens the Maps app on phones. */
const MAP_URL = "https://share.google/zzdnCqgBYvzdfErGM";

/**
 * Keyless Google Maps embed, driven by the postal address. Google rewrites
 * this to /maps/embed?pb=…, where `t=k` becomes the `!5e1` satellite token and
 * `z=16` becomes `!6i16`; drop `t=k` and it falls back to the plain map.
 * To pin it exactly, open the listing in Google Maps → Share → Embed a map
 * with satellite already selected, and paste that iframe's src here instead.
 */
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  "Radha Vatika, Chansad-Padra Main Road, Darapura, Padra, Vadodara, Gujarat 391440"
)}&t=k&z=16&output=embed`;

type FieldErrors = Partial<Record<"name" | "phone" | "email", string>>;

/** Gmail's compose deep-link — opens a new mail with everything filled in. */
function gmailComposeUrl(subject: string, body: string) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: EMAIL,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

function mailtoUrl(subject: string, body: string) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

export default function Contact() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [opened, setOpened] = useState<{ gmail: string; mailto: string } | null>(
    null
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: FieldErrors = {};
    if (name.length < 2) next.name = "Please enter your name.";
    if (phone.replace(/\D/g, "").length < 10)
      next.phone = "Please enter a valid phone number.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email address.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      setOpened(null);
      return;
    }

    const subject = `Enquiry — Radha Vatika (${name})`;
    const body = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email || "—"}`,
      "",
      message || "I'd like to know more about Radha Vatika.",
    ].join("\n");

    const links = {
      gmail: gmailComposeUrl(subject, body),
      mailto: mailtoUrl(subject, body),
    };
    // opened straight from the click, so it isn't treated as a popup
    window.open(links.gmail, "_blank", "noopener,noreferrer");
    setOpened(links);
  };

  const inputCls =
    "w-full rounded-lg border border-line bg-transparent px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-2/70 focus:border-accent";
  const labelCls = "mb-1.5 block text-[12px] uppercase tracking-wider text-ink-2";
  const errCls = "mt-1.5 text-[12px] text-[#b4442a]";

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

              <a
                href={MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-bone">
                  <MapPin size={18} />
                </span>
                <span>
                  <span className="block text-[12px] uppercase tracking-wider text-ink-2">
                    Site address
                  </span>
                  <span className="block max-w-xs text-[15px] leading-relaxed text-ink transition-colors group-hover:text-accent">
                    {ADDRESS}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-wider text-accent">
                    View on Google Maps
                    <ArrowUpRight size={13} strokeWidth={2.4} />
                  </span>
                </span>
              </a>
            </div>
          </Reveal>

          <Reveal i={3}>
            <div className="mt-10 overflow-hidden rounded-[22px] border border-line">
              <iframe
                src={MAP_EMBED_SRC}
                title="Radha Vatika location on Google Maps"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="block h-[260px] w-full border-0 sm:h-[320px]"
              />
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
                <label htmlFor="enq-name" className={labelCls}>
                  Name
                </label>
                <input
                  id="enq-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  className={inputCls}
                />
                {errors.name && <p className={errCls}>{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="enq-phone" className={labelCls}>
                  Phone
                </label>
                <input
                  id="enq-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  aria-invalid={!!errors.phone}
                  className={inputCls}
                />
                {errors.phone && <p className={errCls}>{errors.phone}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="enq-email" className={labelCls}>
                Email
              </label>
              <input
                id="enq-email"
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className={inputCls}
              />
              {errors.email && <p className={errCls}>{errors.email}</p>}
            </div>
            <div className="mt-4">
              <label htmlFor="enq-message" className={labelCls}>
                Message
              </label>
              <textarea
                id="enq-message"
                name="message"
                rows={4}
                placeholder="Tell us what you're looking for…"
                className={`${inputCls} resize-none`}
              />
            </div>

            <div aria-live="polite">
              {Object.keys(errors).length > 0 && (
                <p className="mt-5 rounded-lg bg-[#b4442a]/10 px-4 py-3 text-[13px] leading-relaxed text-[#b4442a]">
                  Please check the highlighted fields.
                </p>
              )}

              {opened && (
                <div className="mt-5 rounded-lg bg-accent/10 px-4 py-3 text-[13px] leading-relaxed text-accent">
                  Gmail has opened in a new tab with your enquiry ready — just
                  press <strong>Send</strong> there to reach us.
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
                    <a
                      href={opened.gmail}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2"
                    >
                      Didn&apos;t open? Click here
                    </a>
                    <a
                      href={opened.mailto}
                      className="underline underline-offset-2"
                    >
                      Use a different email app
                    </a>
                  </div>
                </div>
              )}
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
