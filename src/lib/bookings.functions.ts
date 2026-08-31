import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { bookingSchema, BOOKING_STATUSES } from "@/lib/booking-schema";

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const ref = `MNV-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        booking_ref: ref,
        full_name: data.fullName,
        company: data.company || null,
        email: data.email,
        phone: data.phone,
        preferred_date: data.date,
        preferred_time: data.time,
        time_zone: data.timeZone,
        message: data.message || null,
        status: "new",
        calendar_status: "not_created",
      })
      .select()
      .single();

    if (error || !booking) {
      throw new Error("We could not save your request. Please try again.");
    }

    // Calendar failures must never lose the booking.
    let calendarStatus: "created" | "failed" | "retry_required" = "failed";
    let calendarError: string | null = null;
    let eventId: string | null = null;
    let link: string | null = null;

    try {
      const { createCalendarEvent, readCalendarConfig } = await import(
        "@/lib/google-calendar.server"
      );
      if (!readCalendarConfig()) {
        calendarStatus = "retry_required";
        calendarError = "Google Calendar is not configured yet.";
      } else {
        const event = await createCalendarEvent(booking);
        eventId = event.eventId;
        link = event.link;
        calendarStatus = "created";
      }
    } catch (err) {
      calendarStatus = "failed";
      calendarError = err instanceof Error ? err.message : "Unknown calendar error";
    }

    await supabaseAdmin
      .from("bookings")
      .update({
        calendar_status: calendarStatus,
        calendar_event_id: eventId,
        calendar_link: link,
        calendar_error: calendarError,
      })
      .eq("id", booking.id);

    return {
      bookingRef: booking.booking_ref,
      date: booking.preferred_date,
      time: booking.preferred_time,
      timeZone: booking.time_zone,
    };
  });

export const listBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const isAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) throw new Error(error.message);
    return { admin: Boolean(data) };
  });

/**
 * Safely makes the first authenticated account the MENOVO admin.
 * The database function takes a transaction lock, so two simultaneous
 * first logins cannot create two admins.
 */
export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("claim_first_admin");
    if (error) throw new Error(error.message);
    return {
      admin: Boolean(data),
      reason: data ? null : "An admin already exists for another account.",
    };
  });

export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: string }) => {
    if (!BOOKING_STATUSES.includes(input.status as (typeof BOOKING_STATUSES)[number])) {
      throw new Error("Invalid status");
    }
    return input;
  })
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("bookings")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    if (data.status === "cancelled") {
      const { data: booking } = await context.supabase
        .from("bookings")
        .select("calendar_event_id, calendar_status")
        .eq("id", data.id)
        .maybeSingle();
      if (booking?.calendar_event_id && booking.calendar_status === "created") {
        try {
          const { cancelCalendarEvent } = await import("@/lib/google-calendar.server");
          await cancelCalendarEvent(booking.calendar_event_id);
          await context.supabase
            .from("bookings")
            .update({ calendar_status: "cancelled" })
            .eq("id", data.id);
        } catch {
          await context.supabase
            .from("bookings")
            .update({ calendar_status: "retry_required" })
            .eq("id", data.id);
        }
      }
    }
    return { ok: true };
  });

export const retryCalendar = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { data: booking, error } = await context.supabase
      .from("bookings")
      .select("*")
      .eq("id", data.id)
      .single();
    if (error || !booking) throw new Error("Booking not found.");

    try {
      const { createCalendarEvent } = await import("@/lib/google-calendar.server");
      const event = await createCalendarEvent(booking);
      await context.supabase
        .from("bookings")
        .update({
          calendar_status: "created",
          calendar_event_id: event.eventId,
          calendar_link: event.link,
          calendar_error: null,
        })
        .eq("id", data.id);
      return { ok: true, error: null };
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Unknown calendar error";
      await context.supabase
        .from("bookings")
        .update({ calendar_status: "failed", calendar_error: messageText })
        .eq("id", data.id);
      return { ok: false, error: messageText };
    }
  });
