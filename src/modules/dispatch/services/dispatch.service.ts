// src/modules/dispatch/services/dispatch.service.ts
import { supabase } from "@/lib/supabase";

export async function dispatchBooking(input: { booking_id: string; vehicle_id: string; driver_id: string; notes?: string }) {
  const { error } = await supabase.rpc("dispatch_booking", {
    p_booking_id: input.booking_id,
    p_vehicle_id: input.vehicle_id,
    p_driver_id: input.driver_id,
    p_notes: input.notes ?? null,
  });
  if (error) throw error;
}