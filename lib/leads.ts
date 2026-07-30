"use server";

export type LeadFieldErrors = Partial<
  Record<"name" | "phone" | "email" | "message", string>
>;

export type LeadState = {
  status: "idle" | "sent" | "error";
  message: string;
  fieldErrors?: LeadFieldErrors;
  /** echoed back so a failed submit doesn't wipe what was typed */
  values?: { name: string; phone: string; email: string; message: string };
};

/** Brochure form only: true once the visitor may proceed to the download. */
export type BrochureLeadState = LeadState & { allowDownload: boolean };

const PHONE_DISPLAY = "+91 63563 46862";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DELIVERY_ERROR = `We couldn't send your details just now. Please call us on ${PHONE_DISPLAY} and we'll help you right away.`;

type Lead = {
  name: string;
  phone: string;
  email: string;
  message: string;
  source: string;
};

/** Pulls and trims the shared field set. `phone` covers the brochure form's
 *  "mobile" input too — both post under the same key server-side. */
function readLead(formData: FormData, source: string): Lead {
  return {
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
    source,
  };
}

/** The subset echoed back to the form, i.e. everything except `source`. */
function echoValues(lead: Lead) {
  return {
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    message: lead.message,
  };
}

function validate(lead: Lead): LeadFieldErrors {
  const errors: LeadFieldErrors = {};
  if (lead.name.length < 2) errors.name = "Please enter your name.";
  if (lead.phone.replace(/\D/g, "").length < 10)
    errors.phone = "Please enter a valid 10-digit mobile number.";
  if (lead.email && !EMAIL_RE.test(lead.email))
    errors.email = "Please enter a valid email address.";
  return errors;
}

/**
 * Hands the lead to the Apps Script web app, which emails it and appends it to
 * the sheet. Returns false when it could not be delivered — the caller decides
 * what that means for the visitor.
 */
async function deliver(lead: Lead): Promise<boolean> {
  const endpoint = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_SHARED_SECRET;

  if (!endpoint || !secret) {
    console.error(
      "GOOGLE_SHEETS_WEBHOOK_URL / GOOGLE_SHEETS_SHARED_SECRET are not set — lead was NOT delivered:",
      lead
    );
    return false;
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, ...lead }),
      // Apps Script /exec answers with a 302 to googleusercontent.com; fetch
      // follows it by default. Don't let a hung request hold the action open.
      signal: AbortSignal.timeout(10_000),
    });

    const data: unknown = await res.json().catch(() => null);
    const payload = (data ?? {}) as { success?: boolean; mailError?: string };

    if (!res.ok || payload.success !== true) {
      console.error("Lead handler rejected the submission:", res.status, data, lead);
      return false;
    }

    // Stored but the email didn't go out (usually the daily Gmail quota).
    // Still a success from the visitor's point of view.
    if (payload.mailError) {
      console.error("Lead stored but email failed:", payload.mailError, lead);
    }

    return true;
  } catch (err) {
    console.error("Failed to deliver lead:", err, lead);
    return false;
  }
}

/** Contact section — "Send Enquiry". */
export async function sendEnquiry(
  _prev: LeadState,
  formData: FormData
): Promise<LeadState> {
  // Honeypot: bots fill every field, humans never see this one.
  if (String(formData.get("botcheck") ?? "").length > 0) {
    return { status: "sent", message: "Thank you — we'll be in touch shortly." };
  }

  const lead = readLead(formData, "Website enquiry");
  const values = echoValues(lead);

  const fieldErrors = validate(lead);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors,
      values,
    };
  }

  if (!(await deliver(lead))) {
    return { status: "error", message: DELIVERY_ERROR, values };
  }

  return {
    status: "sent",
    message: "Thank you — your enquiry has reached us. We'll get back to you shortly.",
  };
}

/** Brochure section — gate in front of the PDF. */
export async function saveBrochureLead(
  _prev: BrochureLeadState,
  formData: FormData
): Promise<BrochureLeadState> {
  if (String(formData.get("botcheck") ?? "").length > 0) {
    return { status: "sent", message: "", allowDownload: true };
  }

  const lead = readLead(formData, "Brochure download");
  const values = echoValues(lead);

  const fieldErrors = validate(lead);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "",
      fieldErrors,
      values,
      allowDownload: false,
    };
  }

  // Never hold the brochure hostage to our own plumbing: if delivery fails the
  // download still goes ahead, and the lost lead is logged above.
  if (!(await deliver(lead))) {
    return {
      status: "error",
      message:
        "We couldn't save your details, but your brochure is ready below.",
      values,
      allowDownload: true,
    };
  }

  return {
    status: "sent",
    message: "Thank you — your brochure is downloading.",
    allowDownload: true,
  };
}
