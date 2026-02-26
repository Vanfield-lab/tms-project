import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CreateBooking() {
  const [purpose, setPurpose] = useState("");

  const handleCreate = async () => {
    const { data: user } = await supabase.auth.getUser();

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.user?.id)
      .single();

    await supabase.from("bookings").insert({
      created_by: user.user?.id,
      division_id: profile.division_id,
      unit_id: profile.unit_id,
      purpose,
      pickup_location: "Office",
      dropoff_location: "Location",
      trip_date: "2026-01-01",
      trip_time: "08:00",
      booking_type: "official"
    });
  };

  return (
    <div>
      <h2>Create Booking</h2>
      <input
        placeholder="Purpose"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
      />
      <button onClick={handleCreate}>Create Draft</button>
    </div>
  );
}