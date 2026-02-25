import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type StatusCount = { status: string; total: number };
type DailyCount = { trip_date: string; total: number };
type FuelMonthly = { month: string; requests: number; total_liters: number; total_amount: number };
type MaintMonthly = { month: string; requests: number; closed_count: number };
type UtilRow = { vehicle_id: string; plate_number: string; trips: number };

export default function ReportsDashboard() {
  const [kpis, setKpis] = useState<any>(null);
  const [statusCounts, setStatusCounts] = useState<StatusCount[]>([]);
  const [dailyCounts, setDailyCounts] = useState<DailyCount[]>([]);
  const [fuelMonthly, setFuelMonthly] = useState<FuelMonthly[]>([]);
  const [maintMonthly, setMaintMonthly] = useState<MaintMonthly[]>([]);
  const [util, setUtil] = useState<UtilRow[]>([]);

  const load = async () => {
    const { data: k } = await supabase.rpc("report_kpis");
    setKpis(k);

    const { data: s } = await supabase.from("v_booking_status_counts").select("*");
    setStatusCounts((s as any) || []);

    const { data: d } = await supabase.from("v_booking_daily_counts").select("*");
    setDailyCounts((d as any) || []);

    const { data: f } = await supabase.from("v_fuel_monthly_totals").select("*");
    setFuelMonthly((f as any) || []);

    const { data: m } = await supabase.from("v_maintenance_monthly_totals").select("*");
    setMaintMonthly((m as any) || []);

    const { data: u } = await supabase.from("v_vehicle_utilization_30d").select("*");
    setUtil((u as any) || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Reports</h2>

      {kpis && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, marginBottom: 14 }}>
          <div style={{ border: "1px solid #ddd", padding: 10 }}>Bookings (30d): <b>{kpis.bookings_30d}</b></div>
          <div style={{ border: "1px solid #ddd", padding: 10 }}>Pending approvals: <b>{kpis.pending_approvals}</b></div>
          <div style={{ border: "1px solid #ddd", padding: 10 }}>Approved not dispatched: <b>{kpis.approved_not_dispatched}</b></div>
          <div style={{ border: "1px solid #ddd", padding: 10 }}>Active trips: <b>{kpis.active_trips}</b></div>
          <div style={{ border: "1px solid #ddd", padding: 10 }}>Fuel submitted: <b>{kpis.fuel_submitted}</b></div>
          <div style={{ border: "1px solid #ddd", padding: 10 }}>Maintenance open: <b>{kpis.maintenance_open}</b></div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
        <div style={{ border: "1px solid #ddd", padding: 12 }}>
          <h3>Booking Status (90d)</h3>
          {statusCounts.map((r, i) => (
            <div key={i}>{r.status}: <b>{r.total}</b></div>
          ))}
        </div>

        <div style={{ border: "1px solid #ddd", padding: 12 }}>
          <h3>Bookings per Day (30d)</h3>
          {dailyCounts.map((r, i) => (
            <div key={i}>{r.trip_date}: <b>{r.total}</b></div>
          ))}
        </div>

        <div style={{ border: "1px solid #ddd", padding: 12 }}>
          <h3>Fuel Monthly (12m)</h3>
          {fuelMonthly.map((r, i) => (
            <div key={i}>
              {r.month}: req <b>{r.requests}</b> | liters <b>{r.total_liters}</b> | amount <b>{r.total_amount}</b>
            </div>
          ))}
        </div>

        <div style={{ border: "1px solid #ddd", padding: 12 }}>
          <h3>Maintenance Monthly (12m)</h3>
          {maintMonthly.map((r, i) => (
            <div key={i}>
              {r.month}: req <b>{r.requests}</b> | closed <b>{r.closed_count}</b>
            </div>
          ))}
        </div>

        <div style={{ border: "1px solid #ddd", padding: 12, gridColumn: "1 / -1" }}>
          <h3>Vehicle Utilization (30d)</h3>
          {util.map((r, i) => (
            <div key={i}>{r.plate_number}: <b>{r.trips}</b> trips</div>
          ))}
        </div>
      </div>
    </div>
  );
}