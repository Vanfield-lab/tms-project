import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Vehicle = { id: string; plate_number: string };

export default function ReportMaintenance() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleId, setVehicleId] = useState("");
  const [issue, setIssue] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("vehicles")
        .select("id,plate_number")
        .order("plate_number", { ascending: true });
      setVehicles((data as Vehicle[]) || []);
    })();
  }, []);

  const submit = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user || !vehicleId || !issue) return;

    await supabase.from("maintenance_requests").insert({
      vehicle_id: vehicleId,
      reported_by: u.user.id,
      issue_description: issue,
    });

    setIssue("");
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Report Maintenance</h2>

      <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
        <option value="">Select Vehicle</option>
        {vehicles.map((v) => (
          <option key={v.id} value={v.id}>{v.plate_number}</option>
        ))}
      </select>

      <div style={{ marginTop: 8 }}>
        <textarea
          placeholder="Describe the issue..."
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          style={{ width: "70%", height: 80 }}
        />
      </div>

      <button onClick={submit}>Submit</button>
    </div>
  );
}