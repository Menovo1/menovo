/**
 * Google Calendar integration (server only).
 *
 * Uses a Google service account (domain-wide or a calendar shared with the
 * service account email). Required secrets:
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL
 *   GOOGLE_PRIVATE_KEY          (PEM, "\n" escaped is fine)
 *   GOOGLE_CALENDAR_ID          (e.g. the Google account email / calendar id)
 */

const SCOPE = "https://www.googleapis.com/auth/calendar";

export type CalendarConfig = {
  clientEmail: string;
  privateKey: string;
  calendarId: string;
};

export function readCalendarConfig(): CalendarConfig | null {
  const clientEmail = process.env["GOOGLE_SERVICE_ACCOUNT_EMAIL"];
  const privateKey = process.env["GOOGLE_PRIVATE_KEY"];
  const calendarId = process.env["GOOGLE_CALENDAR_ID"];
  if (!clientEmail || !privateKey || !calendarId) return null;
  return { clientEmail, privateKey: privateKey.replace(/\\n/g, "\n"), calendarId };
}

function base64url(bytes: Uint8Array | string): string {
  const raw =
    typeof bytes === "string"
      ? bytes
      : Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const body = pem
    .replace(/-----BEGIN [^-]+-----/, "")
    .replace(/-----END [^-]+-----/, "")
    .replace(/\s+/g, "");
  const binary = atob(body);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) buffer[i] = binary.charCodeAt(i);
  return buffer.buffer;
}

async function getAccessToken(config: CalendarConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: config.clientEmail,
      scope: SCOPE,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const signingInput = `${header}.${claim}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(config.privateKey),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(
    await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(signingInput)),
  );
  const assertion = `${signingInput}.${base64url(signature)}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const json = (await res.json()) as { access_token?: string; error_description?: string };
  if (!res.ok || !json.access_token) {
    throw new Error(json.error_description ?? `Google token request failed (${res.status})`);
  }
  return json.access_token;
}

export type BookingForCalendar = {
  booking_ref: string;
  full_name: string;
  company: string | null;
  email: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  time_zone: string;
  message: string | null;
};

function addMinutes(time: string, minutes: number): string {
  const [h = "0", m = "0"] = time.split(":");
  const total = Number(h) * 60 + Number(m) + minutes;
  const hh = String(Math.floor((total % 1440) / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

export async function createCalendarEvent(
  booking: BookingForCalendar,
): Promise<{ eventId: string; link: string }> {
  const config = readCalendarConfig();
  if (!config) throw new Error("Google Calendar is not configured.");

  const token = await getAccessToken(config);
  const startTime = booking.preferred_time.slice(0, 5);
  const endTime = addMinutes(startTime, 45);

  const body = {
    summary: `MENOVO — Hotel Website Consultation — ${booking.company || booking.full_name}`,
    description: [
      `Booking ID: ${booking.booking_ref}`,
      `Client: ${booking.full_name}`,
      `Hotel / Company: ${booking.company ?? "—"}`,
      `Email: ${booking.email}`,
      `WhatsApp / Phone: ${booking.phone}`,
      `Client time zone: ${booking.time_zone}`,
      "",
      "Project / Message:",
      booking.message ?? "—",
      "",
      "Meeting is handled via WhatsApp or Zoom.",
    ].join("\n"),
    start: { dateTime: `${booking.preferred_date}T${startTime}:00`, timeZone: booking.time_zone },
    end: { dateTime: `${booking.preferred_date}T${endTime}:00`, timeZone: booking.time_zone },
  };

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(config.calendarId)}/events`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  const json = (await res.json()) as {
    id?: string;
    htmlLink?: string;
    error?: { message?: string };
  };
  if (!res.ok || !json.id) {
    throw new Error(json.error?.message ?? `Google Calendar error (${res.status})`);
  }
  return { eventId: json.id, link: json.htmlLink ?? "" };
}

export async function cancelCalendarEvent(eventId: string): Promise<void> {
  const config = readCalendarConfig();
  if (!config) throw new Error("Google Calendar is not configured.");
  const token = await getAccessToken(config);
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(config.calendarId)}/events/${encodeURIComponent(eventId)}`,
    { method: "DELETE", headers: { authorization: `Bearer ${token}` } },
  );
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    throw new Error(`Google Calendar delete failed (${res.status})`);
  }
}
