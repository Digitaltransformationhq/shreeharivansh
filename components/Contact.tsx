"use client";

import { useActionState, useEffect, useRef } from "react";
import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import Reveal from "./ui/Reveal";
import { sendEnquiry, type LeadState } from "@/lib/leads";

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

const INITIAL_STATE: LeadState = { status: "idle", message: "" };

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    sendEnquiry,
    INITIAL_STATE
  );

  // clear the fields once an enquiry has actually gone out
  useEffect(() => {
    if (state.status === "sent") formRef.current?.reset();
  }, [state]);

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
            ref={formRef}
            action={formAction}
            className="rounded-[22px] border border-line bg-paper p-6 shadow-[0_20px_45px_-30px_rgba(22,19,15,0.3)] sm:p-8"
          >
            {/* honeypot — hidden from people, irresistible to bots */}
            <input
              type="text"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

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
                  defaultValue={state.values?.name}
                  aria-invalid={!!state.fieldErrors?.name}
                  className={inputCls}
                />
                {state.fieldErrors?.name && (
                  <p className={errCls}>{state.fieldErrors.name}</p>
                )}
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
                  defaultValue={state.values?.phone}
                  aria-invalid={!!state.fieldErrors?.phone}
                  className={inputCls}
                />
                {state.fieldErrors?.phone && (
                  <p className={errCls}>{state.fieldErrors.phone}</p>
                )}
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
                defaultValue={state.values?.email}
                aria-invalid={!!state.fieldErrors?.email}
                className={inputCls}
              />
              {state.fieldErrors?.email && (
                <p className={errCls}>{state.fieldErrors.email}</p>
              )}
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
              {state.message && (
                <p
                  className={`mt-5 rounded-lg px-4 py-3 text-[13px] leading-relaxed ${
                    state.status === "sent"
                      ? "bg-accent/10 text-accent"
                      : "bg-[#b4442a]/10 text-[#b4442a]"
                  }`}
                >
                  {state.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-6 w-full rounded-lg bg-ink px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-bone transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Sending…" : "Send Enquiry"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
