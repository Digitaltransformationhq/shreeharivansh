"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import { saveBrochureLead, type BrochureLeadState } from "@/lib/leads";

const PDF_HREF = "/brochure/radha-vatika-brochure.pdf";
const PDF_FILENAME = "Radha-Vatika-Brochure.pdf";
/** Once details are given, don't ask again for the rest of the visit. */
const SESSION_KEY = "rv-brochure-lead";

const INITIAL_STATE: BrochureLeadState = {
  status: "idle",
  message: "",
  allowDownload: false,
};

export default function BrochureDownload() {
  const [open, setOpen] = useState(false);
  const dialogTitleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const [state, formAction, pending] = useActionState(
    saveBrochureLead,
    INITIAL_STATE
  );

  // Details already given this visit? Hand over the file without asking again.
  const onDownloadClick = () => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      downloadRef.current?.click();
      return;
    }
    setOpen(true);
  };

  // Kick off the actual download the moment the lead has been handled.
  useEffect(() => {
    if (!open || !state.allowDownload) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    downloadRef.current?.click();
    if (state.status !== "sent") return;
    const t = setTimeout(() => setOpen(false), 2200);
    return () => clearTimeout(t);
  }, [open, state]);

  // Esc to close + lock background scroll while the dialog is up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const inputCls =
    "w-full rounded-lg border border-line bg-transparent px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-2/70 focus:border-accent";
  const labelCls =
    "mb-1.5 block text-[12px] uppercase tracking-wider text-ink-2";
  const errCls = "mt-1.5 text-[12px] text-[#b4442a]";

  return (
    <>
      {/* The real download target — clicked programmatically, and offered as a
          visible fallback if saving the details failed. */}
      <a
        ref={downloadRef}
        href={PDF_HREF}
        download={PDF_FILENAME}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      <button
        type="button"
        onClick={onDownloadClick}
        className="inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-bone transition-colors hover:bg-accent"
      >
        <Download size={16} strokeWidth={2.2} />
        Download Brochure
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/60 backdrop-blur-sm"
          />

          <div className="relative z-10 w-full max-w-md rounded-[22px] border border-line bg-paper p-6 shadow-[0_30px_70px_-30px_rgba(22,19,15,0.5)] sm:p-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-bone-2 hover:text-ink"
            >
              <X size={18} />
            </button>

            <h3
              id={dialogTitleId}
              className="pr-10 text-[clamp(1.4rem,3vw,1.9rem)] font-light leading-tight tracking-tight text-ink"
            >
              Almost there —{" "}
              <span className="font-display italic text-accent">
                tell us who you are
              </span>
            </h3>
            <p className="mt-2.5 text-[13px] leading-relaxed text-ink-2">
              Share your name and mobile number and the Radha Vatika brochure
              will download right away.
            </p>

            <form action={formAction} className="mt-6">
              <input
                type="text"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <div>
                <label htmlFor="lead-name" className={labelCls}>
                  Name
                </label>
                <input
                  ref={firstFieldRef}
                  id="lead-name"
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

              <div className="mt-4">
                <label htmlFor="lead-mobile" className={labelCls}>
                  Mobile number
                </label>
                <input
                  id="lead-mobile"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="10-digit mobile number"
                  defaultValue={state.values?.phone}
                  aria-invalid={!!state.fieldErrors?.phone}
                  className={inputCls}
                />
                {state.fieldErrors?.phone && (
                  <p className={errCls}>{state.fieldErrors.phone}</p>
                )}
              </div>

              <div className="mt-4">
                <label htmlFor="lead-email" className={labelCls}>
                  Email <span className="normal-case">(optional)</span>
                </label>
                <input
                  id="lead-email"
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

              <div aria-live="polite">
                {state.message && (
                  <div
                    className={`mt-5 rounded-lg px-4 py-3 text-[13px] leading-relaxed ${
                      state.status === "sent"
                        ? "bg-accent/10 text-accent"
                        : "bg-[#b4442a]/10 text-[#b4442a]"
                    }`}
                  >
                    {state.message}
                    {state.status === "error" && (
                      <a
                        href={PDF_HREF}
                        download={PDF_FILENAME}
                        className="mt-2 block text-[12px] underline underline-offset-2"
                      >
                        Download brochure
                      </a>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={pending}
                className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-ink px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-bone transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download size={16} strokeWidth={2.2} />
                {pending ? "Please wait…" : "Get the Brochure"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
