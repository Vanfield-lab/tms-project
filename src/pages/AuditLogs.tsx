import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Audit = {
  id: string;
  actor_user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata: any;
  created_at: string;
};

export default function AuditLogs() {
  const [rows, setRows] = useState<Audit[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("audit_logs")
        .select("id,actor_user_id,action,entity_type,entity_id,metadata,created_at")
        .order("created_at", { ascending: false })
        .limit(200);

      setRows((data as Audit[]) || []);
    })();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Audit Logs</h2>
      {rows.map((r) => (
        <div key={r.id} style={{ border: "1px solid #eee", padding: 10, marginBottom: 8 }}>
          <div><b>{r.action}</b> — {new Date(r.created_at).toLocaleString()}</div>
          <div style={{ fontSize: 12 }}>
            actor: {r.actor_user_id} | {r.entity_type}:{r.entity_id}
          </div>
          <pre style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>
            {JSON.stringify(r.metadata, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
}