import { useState } from "react";
import AppShell from "../app/AppShell";
import ReportsDashboard from "../modules/reports/pages/ReportsDashboard";
import DispatchBoard from "../modules/dispatch/pages/DispatchBoard";
import CloseTrips from "../modules/bookings/pages/CloseTrips";
import MaintenanceBoard from "../modules/maintenance/pages/MaintenanceBoard";
import ShiftAdmin from "../modules/shifts/pages/ShiftAdmin";

export default function TransportLayout() {
  const [page, setPage] = useState<"reports" | "dispatch" | "close" | "maintenance" | "shifts">("dispatch");

  return (
    <AppShell
      title="Transport"
      nav={[
        { label: "Dispatch", onClick: () => setPage("dispatch") },
        { label: "Close Trips", onClick: () => setPage("close") },
        { label: "Maintenance", onClick: () => setPage("maintenance") },
        { label: "Shift Overrides", onClick: () => setPage("shifts") },
        { label: "Reports", onClick: () => setPage("reports") },
      ]}
    >
      {page === "dispatch" && <DispatchBoard />}
      {page === "close" && <CloseTrips />}
      {page === "maintenance" && <MaintenanceBoard />}
      {page === "shifts" && <ShiftAdmin />}
      {page === "reports" && <ReportsDashboard />}
    </AppShell>
  );
}