import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Req = {
  id: string;
  vehicle_id: string;
  issue_description: string;
  status: string;
  created_at: string;
};

export default function MaintenanceBoard() {
  const [items, setItems] = useState<Req[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = async () => {
    const { data } = await supabase
      .from("maintenance_requests")
      .select("id,vehicle_id,issue_description,status,created_at")
      .order("created_at", { ascending: false });

    setItems((data as Req[]) || []);
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: "approved" | "in_progress" | "completed") => {
    await supabase.rpc("update_maintenance_status", {
      p_request_id: id,
      p_new_status: status,
    });
    await load();
  };

  const confirm = async (id: string) => {
    await supabase.rpc("confirm_maintenance_completion", {
      p_request_id: id,
      p_notes: notes[id] || null,
    });
    await load();
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Maintenance Board</h2>

      {items.map((r) => (
        <div key={r.id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10 }}>
          <div><b>Status:</b> {r.status}</div>
          <div><b>Issue:</b> {r.issue_description}</div>

          <div style={{ marginTop: 8 }}>
            {r.status === "reported" && (
              <>
                <button onClick={() => setStatus(r.id, "approved")}>Approve</button>{" "}
                <button onClick={() => setStatus(r.id, "in_progress")}>Start</button>
              </>
            )}

            {r.status === "approved" && (
              <button onClick={() => setStatus(r.id, "in_progress")}>Start</button>
            )}

            {r.status === "in_progress" && (
              <button onClick={() => setStatus(r.id, "completed")}>Mark Completed</button>
            )}

            {r.status === "completed" && (
              <>
                <input
                  placeholder="Completion notes (optional)"
                  value={notes[r.id] || ""}
                  onChange={(e) => setNotes((m) => ({ ...m, [r.id]: e.target.value }))}
                />{" "}
                <button onClick={() => confirm(r.id)}>Confirm & Close</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}