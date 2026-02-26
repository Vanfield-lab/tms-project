// src/modules/bookings/services/bookings.service.ts
import { supabase } from "@/lib/supabase";
import type { Booking } from "../types";

export async function listBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw error;
  return data as Booking[];
}

export async function submitBooking(bookingId: string) {
  const { error } = await supabase.rpc("submit_booking", { p_booking_id: bookingId });
  if (error) throw error;
}