import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Row = {
  driver_id: string;
  shift_date: string;
  effective_shift_code: string;
  base_shift_code: string;
  override_shift_code: string | null;
};

export default function MyShifts() {
  const [rows, setRows] = useState<Row[]>([]);

  const load = async () => {
    const { data } = await supabase
      .from("v_driver_shifts")
      .select("driver_id,shift_date,effective_shift_code,base_shift_code,override_shift_code")
      .order("shift_date", { ascending: true });

    setRows((data as Row[]) || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>My Shifts</h2>
      {rows.map((r, i) => (
        <div key={i} style={{ border: "1px solid #eee", padding: 10, marginBottom: 8 }}>
          <div><b>{r.shift_date}</b> — {r.effective_shift_code}</div>
          {r.override_shift_code && (
            <div style={{ fontSize: 12 }}>
              base: {r.base_shift_code} | override: {r.override_shift_code}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}