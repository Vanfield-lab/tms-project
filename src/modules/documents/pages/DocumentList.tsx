import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Doc = {
  id: string;
  bucket: string;
  path: string;
  file_name: string;
  created_at: string;
};

export default function DocumentList({ entityType, entityId }: { entityType: string; entityId: string }) {
  const [docs, setDocs] = useState<Doc[]>([]);

  const load = async () => {
    const { data } = await supabase
      .from("documents")
      .select("id,bucket,path,file_name,created_at")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false });

    setDocs((data as Doc[]) || []);
  };

  useEffect(() => {
    load();
  }, [entityType, entityId]);

  const open = async (d: Doc) => {
    const { data } = await supabase.storage.from(d.bucket).createSignedUrl(d.path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  return (
    <div style={{ border: "1px solid #eee", padding: 12, marginTop: 10 }}>
      <h3>Documents</h3>
      {docs.map((d) => (
        <div key={d.id} style={{ marginBottom: 6 }}>
          <button onClick={() => open(d)}>{d.file_name}</button>{" "}
          <span style={{ fontSize: 12 }}>{new Date(d.created_at).toLocaleString()}</span>
        </div>
      ))}
      {docs.length === 0 && <div>No documents.</div>}
    </div>
  );
}