import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

type Division = { id: string; name: string };
type Unit = { id: string; name: string; division_id: string; parent_unit_id: string | null };

type Profile = {
  division_id: string | null;
  unit_id: string | null;
};

export default function CreateBookingV2() {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [purpose, setPurpose] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDA, setPickupDA] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [dropoffDA, setDropoffDA] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [tripTime, setTripTime] = useState("");
  const [bookingType, setBookingType] = useState("official");

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [relatedUnitIds, setRelatedUnitIds] = useState<string[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user?.id) return;

      const { data: p } = await supabase
        .from("profiles")
        .select("division_id,unit_id")
        .eq("user_id", u.user.id)
        .single();

      setProfile(p as any);

      const { data: d } = await supabase.from("divisions").select("id,name").order("name");
      setDivisions((d as any) || []);

      const { data: un } = await supabase
        .from("units")
        .select("id,name,division_id,parent_unit_id")
        .order("name");
      setUnits((un as any) || []);
    })();
  }, []);

  const myDivisionUnits = useMemo(() => {
    if (!profile?.division_id) return [];
    return units.filter((u) => u.division_id === profile.division_id);
  }, [units, profile?.division_id]);

  const toggleUnit = (id: string) => {
    setRelatedUnitIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const createDraft = async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user?.id || !profile?.division_id || !profile?.unit_id) return;

    if (!purpose || !pickupLocation || !dropoffLocation || !tripDate || !tripTime) return;

    const { data: inserted, error } = await supabase
      .from("bookings")
      .insert({
        created_by: u.user.id,
        division_id: profile.division_id,
        unit_id: profile.unit_id,
        purpose,
        pickup_location: pickupLocation,
        pickup_digital_address: pickupDA || null,
        dropoff_location: dropoffLocation,
        dropoff_digital_address: dropoffDA || null,
        trip_date: tripDate,
        trip_time: tripTime,
        booking_type: bookingType,
        status: "draft",
      })
      .select("id")
      .single();

    if (error) throw error;

    setDraftId(inserted.id);

    // add visibility links
    if (relatedUnitIds.length > 0) {
      const rows = relatedUnitIds.map((unit_id) => ({ booking_id: inserted.id, unit_id }));
      await supabase.from("booking_visibility_units").insert(rows);
    }

    // reset
    setPurpose("");
    setPickupLocation("");
    setPickupDA("");
    setDropoffLocation("");
    setDropoffDA("");
    setTripDate("");
    setTripTime("");
    setBookingType("official");
    setRelatedUnitIds([]);
  };

  const submitDraft = async () => {
    if (!draftId) return;
    await supabase.rpc("submit_booking", { p_booking_id: draftId });
    setDraftId(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="text-lg font-semibold">New Booking</div>
          <div className="text-sm text-gray-500">Create a draft then submit for approval.</div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="Pickup location" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />
            <Input placeholder="Pickup digital address (optional)" value={pickupDA} onChange={(e) => setPickupDA(e.target.value)} />
            <Input placeholder="Dropoff location" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} />
            <Input placeholder="Dropoff digital address (optional)" value={dropoffDA} onChange={(e) => setDropoffDA(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input type="date" value={tripDate} onChange={(e) => setTripDate(e.target.value)} />
            <Input type="time" value={tripTime} onChange={(e) => setTripTime(e.target.value)} />
            <select
              className="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none"
              value={bookingType}
              onChange={(e) => setBookingType(e.target.value)}
            >
              <option value="official">official</option>
              <option value="production">production</option>
              <option value="event">event</option>
              <option value="news">news</option>
              <option value="other">other</option>
            </select>
          </div>

          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-sm font-medium mb-2">Share with related units (optional)</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-56 overflow-auto">
              {myDivisionUnits.map((u) => (
                <label key={u.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={relatedUnitIds.includes(u.id)}
                    onChange={() => toggleUnit(u.id)}
                  />
                  {u.name}
                </label>
              ))}
            </div>
            {myDivisionUnits.length === 0 && (
              <div className="text-sm text-gray-500">No units found for your division.</div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={createDraft}>Create Draft</Button>
            <Button variant="outline" disabled={!draftId} onClick={submitDraft}>
              Submit Draft
            </Button>
          </div>

          {draftId && <div className="text-sm text-gray-600">Draft created: {draftId}</div>}
        </CardContent>
      </Card>
    </div>
  );
}