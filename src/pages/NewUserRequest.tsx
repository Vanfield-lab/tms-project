import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Division = { id: string; name: string };
type Unit = { id: string; name: string; division_id: string };

export default function NewUserRequest() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [role, setRole] = useState("staff");

  const [divisions, setDivisions] = useState<Division[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    (async () => {
      const { data: d } = await supabase.from("divisions").select("id,name").order("name");
      const { data: u } = await supabase.from("units").select("id,name,division_id").order("name");
      setDivisions((d as Division[]) || []);
      setUnits((u as Unit[]) || []);
    })();
  }, []);

  const submit = async () => {
    const { data: me } = await supabase.auth.getUser();
    if (!me.user?.id) return;

    await supabase.from("user_requests").insert({
      requested_by: me.user.id,
      full_name: fullName,
      email,
      division_id: divisionId,
      unit_id: unitId,
      requested_role: role,
      status: "pending",
    });

    setFullName("");
    setEmail("");
  };

  const filteredUnits = units.filter((u) => !divisionId || u.division_id === divisionId);

  return (
    <div style={{ padding: 16 }}>
      <h2>Request New User</h2>

      <input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <br />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />

      <select value={divisionId} onChange={(e) => setDivisionId(e.target.value)}>
        <option value="">Select Division</option>
        {divisions.map((d) => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>

      <select value={unitId} onChange={(e) => setUnitId(e.target.value)}>
        <option value="">Select Unit</option>
        {filteredUnits.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="staff">staff</option>
        <option value="driver">driver</option>
        <option value="unit_head">unit_head</option>
        <option value="transport_supervisor">transport_supervisor</option>
        <option value="corporate_approver">corporate_approver</option>
      </select>

      <div style={{ marginTop: 10 }}>
        <button onClick={submit}>Submit Request</button>
      </div>
    </div>
  );
}