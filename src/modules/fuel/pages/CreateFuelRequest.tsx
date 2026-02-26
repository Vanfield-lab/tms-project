// src/modules/fuel/pages/CreateFuelRequest.tsx
import { useEffect, useState } from "react";
import { createFuelDraft, submitFuelRequest } from "../services/fuel.service";
import { supabase } from "@/lib/supabase";

type Vehicle = { id: string; plate_number: string; status: string };
type Driver = { id: string; license_number: string; employment_status: string };

export default function CreateFuelRequest() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: v }, { data: d }] = await Promise.all([
        supabase.from("vehicles").select("id, plate_number, status").order("plate_number"),
        supabase.from("drivers").select("id, license_number, employment_status").order("license_number"),
      ]);
      setVehicles((v as Vehicle[]) ?? []);
      setDrivers((d as Driver[]) ?? []);
    })();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    setSaving(true);
    try {
      const draftId = await createFuelDraft({
        vehicle_id: (String(fd.get("vehicle_id") || "") || null) as any,
        driver_id: (String(fd.get("driver_id") || "") || null) as any,
        fuel_type: String(fd.get("fuel_type") || "").trim() || null,
        liters: fd.get("liters") ? Number(fd.get("liters")) : null,
        estimated_cost: fd.get("estimated_cost") ? Number(fd.get("estimated_cost")) : null,
        purpose: String(fd.get("purpose") || "").trim() || null,
        notes: String(fd.get("notes") || "").trim() || null,
      });

      await submitFuelRequest(draftId);
      e.currentTarget.reset();
      alert("Fuel request submitted.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">Create Fuel Request</h1>

      <form onSubmit={onSubmit} className="border rounded-lg p-4 space-y-3 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="space-y-1">
            <div className="text-xs text-muted-foreground">Vehicle (optional)</div>
            <select name="vehicle_id" className="border rounded-md px-3 py-2 text-sm w-full" defaultValue="">
              <option value="">—</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plate_number} ({v.status})
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-xs text-muted-foreground">Driver (optional)</div>
            <select name="driver_id" className="border rounded-md px-3 py-2 text-sm w-full" defaultValue="">
              <option value="">—</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.license_number} ({d.employment_status})
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-xs text-muted-foreground">Fuel Type</div>
            <select name="fuel_type" className="border rounded-md px-3 py-2 text-sm w-full" defaultValue="petrol">
              <option value="petrol">petrol</option>
              <option value="diesel">diesel</option>
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-xs text-muted-foreground">Liters</div>
            <input name="liters" type="number" step="0.01" className="border rounded-md px-3 py-2 text-sm w-full" />
          </label>

          <label className="space-y-1">
            <div className="text-xs text-muted-foreground">Estimated Cost</div>
            <input name="estimated_cost" type="number" step="0.01" className="border rounded-md px-3 py-2 text-sm w-full" />
          </label>

          <label className="space-y-1 md:col-span-2">
            <div className="text-xs text-muted-foreground">Purpose</div>
            <input name="purpose" className="border rounded-md px-3 py-2 text-sm w-full" placeholder="e.g. refuel for assignment" />
          </label>

          <label className="space-y-1 md:col-span-2">
            <div className="text-xs text-muted-foreground">Notes</div>
            <textarea name="notes" className="border rounded-md px-3 py-2 text-sm w-full" rows={4} />
          </label>
        </div>

        <div className="flex justify-end">
          <button disabled={saving} className="bg-black text-white rounded-md px-4 py-2 text-sm disabled:opacity-60">
            {saving ? "Submitting..." : "Submit Fuel Request"}
          </button>
        </div>
      </form>
    </div>
  );
}