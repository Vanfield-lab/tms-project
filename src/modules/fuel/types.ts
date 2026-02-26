// src/modules/fuel/types.ts
export type FuelStatus = "draft" | "submitted" | "approved" | "rejected" | "recorded";

export type FuelRequest = {
  id: string;
  status: FuelStatus;

  requested_by: string;
  unit_id: string | null;
  division_id: string | null;

  vehicle_id: string | null;
  driver_id: string | null;

  fuel_type: string | null;
  liters: number | null;
  estimated_cost: number | null;

  purpose: string | null;
  notes: string | null;

  approved_by: string | null;
  approved_at: string | null;
  recorded_by: string | null;
  recorded_at: string | null;

  created_at: string;
  updated_at: string;
};