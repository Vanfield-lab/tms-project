import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

type Booking = {
  id: string;
  purpose: string;
  trip_date: string;
  trip_time: string;
  pickup_location: string;
  dropoff_location: string;
  status: string;
  booking_type: string;
  created_at: string;
};

export default function BookingsTable() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [q, setQ] = useState("");

  const load = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("id,purpose,trip_date,trip_time,pickup_location,dropoff_location,status,booking_type,created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    setRows((data as any) || []);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.purpose, r.pickup_location, r.dropoff_location, r.status, r.booking_type]
        .join(" ")
        .toLowerCase()
        .includes(s)
    );
  }, [rows, q]);

  const submit = async (id: string) => {
    await supabase.rpc("submit_booking", { p_booking_id: id });
    await load();
  };

  return (
    <Card>
      <CardHeader>
        <div className="text-lg font-semibold">Bookings</div>
        <div className="text-sm text-gray-500">Search and track your bookings.</div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />

        <div className="overflow-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-3">Purpose</th>
                <th className="p-3">Date</th>
                <th className="p-3">From</th>
                <th className="p-3">To</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="p-3">{r.purpose}</td>
                  <td className="p-3">
                    {r.trip_date} {r.trip_time}
                  </td>
                  <td className="p-3">{r.pickup_location}</td>
                  <td className="p-3">{r.dropoff_location}</td>
                  <td className="p-3">{r.booking_type}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">
                    {r.status === "draft" && (
                      <Button variant="outline" onClick={() => submit(r.id)}>
                        Submit
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="p-3 text-gray-500" colSpan={7}>
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}