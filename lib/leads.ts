"use server";

export type LeadFieldErrors = Partial<Record<"name" | "mobile" | "email", string>>;

export type LeadState = {
  status: "idle" | "saved" | "error";
  message: string;
  fieldErrors?: LeadFieldErrors;
  values?: { name: string; mobile: string; email: string };
  /** true when the visitor may proceed to the download */
  allowDownload: boolean;
};

const GENERIC_ERROR =
  "We couldn't save your details just now. You can still download the brochure below.";

export async function saveBrochureLead(
  _prev: LeadState,
  formData: FormData
): Promise<LeadState> {
  // Honeypot — bots fill every field they can see.
  if (String(formData.get("botcheck") ?? "").length > 0) {
    return { status: "saved", message: "", allowDownload: true };
  }

  const name = String(formData.get("name") ?? "").trim();
  const mobile = String(formData.get("mobile") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const values = { name, mobile, email };

  const fieldErrors: LeadFieldErrors = {};
  if (name.length < 2) fieldErrors.name = "Please enter your name.";
  if (mobile.replace(/\D/g, "").length < 10)
    fieldErrors.mobile = "Please enter a valid 10-digit mobile number.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fieldErrors.email = "Please enter a valid email address.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "",
      fieldErrors,
      values,
      allowDownload: false,
    };
  }

  const endpoint = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_SHARED_SECRET;

  if (!endpoint || !secret) {
    console.error(
      "GOOGLE_SHEETS_WEBHOOK_URL / GOOGLE_SHEETS_SHARED_SECRET are not set — brochure lead was NOT saved:",
      values
    );
    return { status: "error", message: GENERIC_ERROR, values, allowDownload: true };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        name,
        mobile,
        email: email || "",
        source: "Brochure download",
      }),
      // Apps Script /exec answers with a 302 to googleusercontent.com; fetch
      // follows it by default. Don't let a hung request hold the action open.
      signal: AbortSignal.timeout(10_000),
    });

    const data: unknown = await res.json().catch(() => null);
    const ok =
      res.ok &&
      typeof data === "object" &&
      data !== null &&
      (data as { success?: boolean }).success === true;

    if (!ok) {
      console.error(
        "Google Sheets webhook rejected the lead:",
        res.status,
        data,
        values
      );
      return {
        status: "error",
        message: GENERIC_ERROR,
        values,
        allowDownload: true,
      };
    }

    return {
      status: "saved",
      message: "Thank you — your brochure is downloading.",
      allowDownload: true,
    };
  } catch (err) {
    console.error("Failed to save brochure lead:", err, values);
    return { status: "error", message: GENERIC_ERROR, values, allowDownload: true };
  }
}
