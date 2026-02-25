import { useAuth } from "../hooks/useAuth";
import AdminLayout from "../layouts/AdminLayout";
import CorporateLayout from "../layouts/CorporateLayout";
import TransportLayout from "../layouts/TransportLayout";
import DepartmentLayout from "../layouts/DepartmentLayout";
import DriverLayout from "../layouts/DriverLayout";

export default function DashboardRouter() {
  const { profile } = useAuth();

  if (!profile) return <div>No profile found</div>;

  switch (profile.system_role) {
    case "admin":
      return <AdminLayout />;
    case "corporate_approver":
      return <CorporateLayout />;
    case "transport_supervisor":
      return <TransportLayout />;
    case "driver":
      return <DriverLayout />;
    default:
      return <DepartmentLayout />;
  }
}