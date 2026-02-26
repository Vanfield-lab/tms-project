import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = {
  entityType: "vehicle" | "driver" | "booking" | "maintenance_request" | "fuel_request";
  entityId: string;
};

const bucketMap: Record<string, string> = {
  vehicle: "vehicle_docs",
  driver: "driver_docs",
  booking: "booking_docs",
  maintenance_request: "maintenance_docs",
  fuel_request: "fuel_docs",
};

export default function UploadDocument({ entityType, entityId }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const upload = async () => {
    if (!file) return;

    const bucket = bucketMap[entityType];
    const ext = file.name.split(".").pop() || "bin";
    const path = `${entityType}/${entityId}/${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

    if (upErr) throw upErr;

    await supabase.rpc("register_document", {
      p_entity_type: entityType,
      p_entity_id: entityId,
      p_bucket: bucket,
      p_path: path,
      p_file_name: file.name,
      p_mime_type: file.type || null,
      p_size: file.size,
    });

    setFile(null);
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, marginTop: 10 }}>
      <h3>Upload Document</h3>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={upload} disabled={!file}>Upload</button>
    </div>
  );
}