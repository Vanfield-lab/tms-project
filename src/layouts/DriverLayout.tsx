import { useState } from "react";
import AppShell from "./AppShell";
import MyShifts from "../pages/MyShifts";
import DriverTrips from "../pages/DriverTrips";
import CreateFuelRequest from "../pages/CreateFuelRequest";

export default function DriverLayout() {
  const [page, setPage] = useState<"shifts" | "trips" | "fuel">("trips");

  return (
    <AppShell
      title="Driver"
      nav={[
        { label: "My Trips", onClick: () => setPage("trips") },
        { label: "My Shifts", onClick: () => setPage("shifts") },
        { label: "Fuel Request", onClick: () => setPage("fuel") },
      ]}
    >
      {page === "trips" && <DriverTrips />}
      {page === "shifts" && <MyShifts />}
      {page === "fuel" && <CreateFuelRequest />}
    </AppShell>
  );
}