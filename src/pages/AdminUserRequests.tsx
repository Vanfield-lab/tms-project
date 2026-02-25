import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Req = {
  id: string;
  full_name: string;
  email: string;
  division_id: string;
  unit_id: string;
  requested_role: string;
  status: string;
  created_at: string;
};

export default function AdminUserRequests() {
  const [rows, setRows] = useState<Req[]>([]);
  const [userId, setUserId] = useState<Record<string, string>>({});
  const [position, setPosition] = useState<Record<string, string>>({});

  const load = async () => {
    const { data } = await supabase
      .from("user_requests")
      .select("id,full_name,email,division_id,unit_id,requested_role,status,created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    setRows((data as Req[]) || []);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (r: Req) => {
    const uid = userId[r.id];
    if (!uid) return;

    await supabase.rpc("admin_approve_user_request", {
      p_request_id: r.id,
      p_user_id: uid,
      p_full_name: r.full_name,
      p_division_id: r.division_id,
      p_unit_id: r.unit_id,
      p_system_role: r.requested_role,
      p_position_title: position[r.id] || null,
    });

    await load();
  };

  const reject = async (r: Req) => {
    await supabase.rpc("admin_reject_user_request", {
      p_request_id: r.id,
      p_reason: "Rejected by admin",
    });
    await load();
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Admin: Pending User Requests</h2>

      {rows.map((r) => (
        <div key={r.id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10 }}>
          <div><b>{r.full_name}</b> — {r.email}</div>
          <div>role: {r.requested_role}</div>

          <div style={{ marginTop: 8 }}>
            <input
              placeholder="Auth User UUID (create in Auth first)"
              value={userId[r.id] || ""}
              onChange={(e) => setUserId((m) => ({ ...m, [r.id]: e.target.value }))}
              style={{ width: "60%" }}
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <input
              placeholder="Position title (optional)"
              value={position[r.id] || ""}
              onChange={(e) => setPosition((m) => ({ ...m, [r.id]: e.target.value }))}
              style={{ width: "60%" }}
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <button onClick={() => approve(r)}>Approve</button>{" "}
            <button onClick={() => reject(r)}>Reject</button>
          </div>
        </div>
      ))}

      {rows.length === 0 && <div>No pending requests.</div>}
    </div>
  );
}