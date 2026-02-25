import { useState } from "react";
import AppShell from "./AppShell";
import CreateBookingV2 from "../pages/CreateBookingV2";
import BookingsTable from "../pages/BookingsTable";
import ReportMaintenance from "../pages/ReportMaintenance";
import CreateFuelRequest from "../pages/CreateFuelRequest";
import NewUserRequest from "../pages/NewUserRequest";

export default function DepartmentLayout() {
  const [page, setPage] = useState<"new" | "my" | "maintenance" | "fuel" | "users">("new");

  return (
    <AppShell
      title="Department"
      nav={[
        { label: "New Booking", onClick: () => setPage("new") },
        { label: "Bookings", onClick: () => setPage("my") },
        { label: "Report Maintenance", onClick: () => setPage("maintenance") },
        { label: "Fuel Request", onClick: () => setPage("fuel") },
        { label: "Request User", onClick: () => setPage("users") },
      ]}
    >
      {page === "new" && <CreateBookingV2 />}
      {page === "my" && <BookingsTable />}
      {page === "maintenance" && <ReportMaintenance />}
      {page === "fuel" && <CreateFuelRequest />}
      {page === "users" && <NewUserRequest />}
    </AppShell>
  );
}