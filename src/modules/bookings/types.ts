// src/modules/bookings/types.ts
export type BookingStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "dispatched"
  | "in_progress"
  | "completed"
  | "closed";

export type Booking = {
  id: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
  staffId?: string | null;
  driverId?: string | null;
  pickupLocation?: string | null;
  dropoffLocation?: string | null;
  date?: string | null;
  time?: string | null;
};