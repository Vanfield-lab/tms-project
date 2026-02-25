import { useState } from "react";
import AppShell from "./AppShell";
import ReportsDashboard from "../pages/ReportsDashboard";
import ApprovalQueue from "../pages/ApprovalQueue";
import FuelApprovalQueue from "../pages/FuelApprovalQueue";

export default function CorporateLayout() {
  const [page, setPage] = useState<"reports" | "bookings" | "fuel">("reports");

  return (
    <AppShell
      title="Corporate Resource"
      nav={[
        { label: "Reports", onClick: () => setPage("reports") },
        { label: "Booking Approvals", onClick: () => setPage("bookings") },
        { label: "Fuel Approvals", onClick: () => setPage("fuel") },
      ]}
    >
      {page === "reports" && <ReportsDashboard />}
      {page === "bookings" && <ApprovalQueue />}
      {page === "fuel" && <FuelApprovalQueue />}
    </AppShell>
  );
}