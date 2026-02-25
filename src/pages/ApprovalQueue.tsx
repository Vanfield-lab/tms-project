import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Booking = {
  id: string;
  purpose: string;
  trip_date: string;
  trip_time: string;
  pickup_location: string;
  dropoff_location: string;
  status: string;
  created_by: string;
};

export default function ApprovalQueue() {
  const [items, setItems] = useState<Booking[]>([]);
  const [comment, setComment] = useState<Record<string, string>>({});

  const load = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("id,purpose,trip_date,trip_time,pickup_location,dropoff_location,status,created_by")
      .eq("status", "submitted")
      .order("created_at", { ascending: false });

    if (!error) setItems((data as Booking[]) || []);
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (bookingId: string, action: "approved" | "rejected") => {
    await supabase.rpc("approve_booking", {
      p_booking_id: bookingId,
      p_action: action,
      p_comment: comment[bookingId] || null,
    });
    await load();
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Approval Queue</h2>

      {items.map((b) => (
        <div key={b.id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10 }}>
          <div><b>Purpose:</b> {b.purpose}</div>
          <div><b>Date:</b> {b.trip_date} <b>Time:</b> {b.trip_time}</div>
          <div><b>From:</b> {b.pickup_location} <b>To:</b> {b.dropoff_location}</div>
          <div style={{ marginTop: 8 }}>
            <input
              placeholder="Comment (optional)"
              value={comment[b.id] || ""}
              onChange={(e) => setComment((m) => ({ ...m, [b.id]: e.target.value }))}
              style={{ width: "60%" }}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => act(b.id, "approved")}>Approve</button>{" "}
            <button onClick={() => act(b.id, "rejected")}>Reject</button>
          </div>
        </div>
      ))}

      {items.length === 0 && <div>No submitted bookings.</div>}
    </div>
  );
}