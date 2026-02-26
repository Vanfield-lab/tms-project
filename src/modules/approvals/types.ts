// src/modules/approvals/types.ts
export type BookingApproval = {
  id: string;
  booking_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};