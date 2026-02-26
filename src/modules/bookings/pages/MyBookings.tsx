import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase.from("bookings").select("*");
      setBookings(data || []);
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h2>My Bookings</h2>
      {bookings.map((b) => (
        <div key={b.id}>
          {b.purpose} — {b.status}
        </div>
      ))}
    </div>
  );
}