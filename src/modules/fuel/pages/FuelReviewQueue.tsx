// src/modules/fuel/pages/FuelReviewQueue.tsx  (CREATE THIS FILE)
import { useEffect, useState } from "react";
import { corporateApproveFuel } from "../services/fuel.service";
import { supabase } from "@/lib/supabase";

export default function FuelReviewQueue() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("fuel_requests")
        .select("*")
        .in("status", ["submitted"])
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;
      setRows(data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function act(id: string, approve: boolean) {
    const notes = prompt(approve ? "Approval notes (optional)" : "Rejection reason (optional)") ?? undefined;
    await corporateApproveFuel(id, approve, notes);
    await load();
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Fuel Approval Queue</h1>

      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 gap-2 bg-muted/30 p-3 text-xs font-medium">
          <div>Status</div>
          <div>Fuel</div>
          <div>Liters</div>
          <div>Est. Cost</div>
          <div>Purpose</div>
          <div>Created</div>
          <div className="text-right">Action</div>
        </div>

        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No submitted fuel requests.</div>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="grid grid-cols-7 gap-2 p-3 border-t text-sm items-center">
              <div className="capitalize">{r.status}</div>
              <div className="capitalize">{r.fuel_type || "—"}</div>
              <div>{r.liters ?? "—"}</div>
              <div>{r.estimated_cost ?? "—"}</div>
              <div className="truncate">{r.purpose ?? "—"}</div>
              <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => act(r.id, true)}
                  className="px-3 py-1 rounded-md bg-black text-white text-xs"
                >
                  Approve
                </button>
                <button
                  onClick={() => act(r.id, false)}
                  className="px-3 py-1 rounded-md border text-xs"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}