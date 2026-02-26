// src/modules/fuel/pages/FuelRequests.tsx
import { useEffect, useState } from "react";
import { listMyFuelRequests } from "../services/fuel.service";

export default function FuelRequests() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const data = await listMyFuelRequests();
      setRows(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Fuel Requests</h1>

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-6 gap-2 bg-muted/30 p-3 text-xs font-medium">
          <div>Status</div>
          <div>Fuel</div>
          <div>Liters</div>
          <div>Cost</div>
          <div>Created</div>
          <div></div>
        </div>

        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No fuel requests.</div>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="grid grid-cols-6 gap-2 p-3 border-t text-sm items-center">
              <div className="capitalize">{r.status}</div>
              <div className="capitalize">{r.fuel_type || "—"}</div>
              <div>{r.liters ?? "—"}</div>
              <div>{r.estimated_cost ?? "—"}</div>
              <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</div>
              <div className="text-right text-xs text-muted-foreground">{r.id.slice(0, 8)}…</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}