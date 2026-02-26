// src/modules/approvals/services/approvals.service.ts
import { supabase } from "@/lib/supabase";

export async function listApprovalQueue() {
  const { data, error } = await supabase
    .from("booking_approvals")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw error;
  return data as any[];
}

export async function approveBooking(bookingId: string, notes?: string) {
  const { error } = await supabase.rpc("approve_booking", { p_booking_id: bookingId, p_notes: notes ?? null });
  if (error) throw error;
}