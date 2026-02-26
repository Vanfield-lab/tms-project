// DepartmentLayout stays navItems-only (OK)
import AppShell from "../app/AppShell";
import CreateBookingV2 from "../modules/bookings/pages/CreateBookingV2";
import BookingsTable from "../modules/bookings/pages/BookingsTable";
import ReportMaintenance from "../modules/maintenance/pages/ReportMaintenance";
import NewUserRequest from "../modules/users/pages/NewUserRequest";
import CreateFuelRequest from "../modules/fuel/pages/CreateFuelRequest";
import FuelRequests from "../modules/fuel/pages/FuelRequests";

export default function DepartmentLayout() {
  return (
    <AppShell
      title="Department"
      navItems={[
        { label: "New Booking", element: <CreateBookingV2 /> },
        { label: "Bookings", element: <BookingsTable /> },
        { label: "Report Maintenance", element: <ReportMaintenance /> },
        {
          label: "Fuel Request",
          element: (
            <div className="space-y-4">
              <CreateFuelRequest />
              <FuelRequests />
            </div>
          ),
        },
        { label: "Request User", element: <NewUserRequest /> },
      ]}
    />
  );
}