import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Trip = {
  id: string;
  purpose: string;
  trip_date: string;
  trip_time: string;
  pickup_location: string;
  dropoff_location: string;
  status: string;
};

export default function DriverTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);

  const load = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("id,purpose,trip_date,trip_time,pickup_location,dropoff_location,status")
      .in("status", ["dispatched", "in_progress", "completed"])
      .order("trip_date", { ascending: true });

    setTrips((data as Trip[]) || []);
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (bookingId: string, newStatus: "in_progress" | "completed") => {
    await supabase.rpc("update_trip_status", {
      p_booking_id: bookingId,
      p_new_status: newStatus,
    });
    await load();
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>My Trips</h2>

      {trips.map((t) => (
        <div key={t.id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10 }}>
          <div><b>{t.purpose}</b></div>
          <div>{t.trip_date} {t.trip_time}</div>
          <div>{t.pickup_location} → {t.dropoff_location}</div>
          <div><b>Status:</b> {t.status}</div>

          <div style={{ marginTop: 10 }}>
            {t.status === "dispatched" && (
              <button onClick={() => setStatus(t.id, "in_progress")}>Start Trip</button>
            )}
            {t.status === "in_progress" && (
              <button onClick={() => setStatus(t.id, "completed")}>Complete Trip</button>
            )}
          </div>
        </div>
      ))}

      {trips.length === 0 && <div>No trips assigned.</div>}
    </div>
  );
}