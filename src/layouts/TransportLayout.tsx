import { useState } from "react";
import AppShell from "./AppShell";
import ReportsDashboard from "../pages/ReportsDashboard";
import DispatchBoard from "../pages/DispatchBoard";
import CloseTrips from "../pages/CloseTrips";
import MaintenanceBoard from "../pages/MaintenanceBoard";
import ShiftAdmin from "../pages/ShiftAdmin";

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