import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Booking = {
  id: string;
  purpose: string;
  trip_date: string;
  trip_time: string;
  pickup_location: string;
  dropoff_location: string;
  status: string;
};

type Vehicle = { id: string; plate_number: string; status: string };
type Driver = { id: string; user_id: string };

export default function DispatchBoard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Record<string, string>>({});
  const [selectedDriver, setSelectedDriver] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = async () => {
    const { data: b } = await supabase
      .from("bookings")
      .select("id,purpose,trip_date,trip_time,pickup_location,dropoff_location,status")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    setBookings((b as Booking[]) || []);

    const { data: v } = await supabase
      .from("vehicles")
      .select("id,plate_number,status")
      .eq("status", "active")
      .order("plate_number", { ascending: true });
    setVehicles((v as Vehicle[]) || []);

    const { data: d } = await supabase.from("drivers").select("id,user_id");
    setDrivers((d as Driver[]) || []);
  };

  useEffect(() => {
    load();
  }, []);

  const dispatch = async (bookingId: string) => {
    const vehicleId = selectedVehicle[bookingId];
    const driverId = selectedDriver[bookingId];

    if (!vehicleId || !driverId) return;

    await supabase.rpc("dispatch_booking", {
      p_booking_id: bookingId,
      p_vehicle_id: vehicleId,
      p_driver_id: driverId,
      p_notes: notes[bookingId] || null,
    });

    await load();
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Dispatch Board</h2>

      {bookings.map((b) => (
        <div key={b.id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 10 }}>
          <div><b>Purpose:</b> {b.purpose}</div>
          <div><b>Date:</b> {b.trip_date} <b>Time:</b> {b.trip_time}</div>
          <div><b>From:</b> {b.pickup_location} <b>To:</b> {b.dropoff_location}</div>

          <div style={{ marginTop: 10 }}>
            <select
              value={selectedVehicle[b.id] || ""}
              onChange={(e) => setSelectedVehicle((m) => ({ ...m, [b.id]: e.target.value }))}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.plate_number}</option>
              ))}
            </select>{" "}
            <select
              value={selectedDriver[b.id] || ""}
              onChange={(e) => setSelectedDriver((m) => ({ ...m, [b.id]: e.target.value }))}
            >
              <option value="">Select Driver</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>{d.id}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: 10 }}>
            <input
              placeholder="Notes (optional)"
              value={notes[b.id] || ""}
              onChange={(e) => setNotes((m) => ({ ...m, [b.id]: e.target.value }))}
              style={{ width: "60%" }}
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <button onClick={() => dispatch(b.id)}>Dispatch</button>
          </div>
        </div>
      ))}

      {bookings.length === 0 && <div>No approved bookings to dispatch.</div>}
    </div>
  );
}