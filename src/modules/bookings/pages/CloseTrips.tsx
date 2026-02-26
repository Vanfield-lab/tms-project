import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Booking = { id: string; purpose: string; trip_date: string; status: string };

export default function CloseTrips() {
  const [items, setItems] = useState<Booking[]>([]);

  const load = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("id,purpose,trip_date,status")
      .eq("status", "completed")
      .order("trip_date", { ascending: false });

    setItems((data as Booking[]) || []);
  };

  useEffect(() => {
    load();
  }, []);

  const close = async (id: string) => {
    await supabase.rpc("close_booking", { p_booking_id: id });
    await load();
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Close Completed Trips</h2>
      {items.map((b) => (
        <div key={b.id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10 }}>
          <div><b>{b.purpose}</b> — {b.trip_date}</div>
          <button onClick={() => close(b.id)}>Close</button>
        </div>
      ))}
      {items.length === 0 && <div>No completed trips.</div>}
    </div>
  );
}