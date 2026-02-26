import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Driver = { id: string; user_id: string };
type Shift = { driver_id: string; shift_date: string; effective_shift_code: string };

export default function ShiftAdmin() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [driverId, setDriverId] = useState("");
  const [date, setDate] = useState("");
  const [code, setCode] = useState("");
  const [reason, setReason] = useState("");

  const load = async () => {
    const { data: d } = await supabase.from("drivers").select("id,user_id");
    setDrivers((d as Driver[]) || []);

    const { data: s } = await supabase
      .from("v_driver_shifts")
      .select("driver_id,shift_date,effective_shift_code")
      .order("shift_date", { ascending: true });

    setShifts((s as Shift[]) || []);
  };

  useEffect(() => {
    load();
  }, []);

  const override = async () => {
    if (!driverId || !date || !code) return;

    await supabase.rpc("override_shift", {
      p_driver_id: driverId,
      p_shift_date: date,
      p_new_shift_code: code,
      p_reason: reason || null,
    });

    setReason("");
    await load();
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Shift Overrides</h2>

      <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>
        <select value={driverId} onChange={(e) => setDriverId(e.target.value)}>
          <option value="">Select Driver</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>{d.id}</option>
          ))}
        </select>{" "}
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />{" "}
        <input placeholder="New Shift Code" value={code} onChange={(e) => setCode(e.target.value)} />{" "}
        <input placeholder="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
        <button onClick={override}>Override</button>
      </div>

      {shifts.map((s, i) => (
        <div key={i} style={{ border: "1px solid #eee", padding: 10, marginBottom: 8 }}>
          <div><b>{s.shift_date}</b> — {s.effective_shift_code}</div>
          <div style={{ fontSize: 12 }}>driver: {s.driver_id}</div>
        </div>
      ))}
    </div>
  );
}