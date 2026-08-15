import { z } from "zod";

export const bookingSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(100),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email.").max(255),
  phone: z
    .string()
    .trim()
    .min(6, "Please enter a valid WhatsApp / phone number.")
    .max(30)
    .regex(/^[+0-9()\s-]+$/, "Please enter a valid WhatsApp / phone number."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a valid date."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Please choose a valid time."),
  timeZone: z.string().trim().min(2, "Please choose your time zone.").max(80),
  message: z.string().trim().max(1500).optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const BOOKING_STATUSES = ["new", "confirmed", "completed", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const CALENDAR_STATUS_LABELS: Record<string, string> = {
  not_created: "Not created",
  created: "Created",
  failed: "Failed",
  cancelled: "Cancelled",
  retry_required: "Retry required",
};
