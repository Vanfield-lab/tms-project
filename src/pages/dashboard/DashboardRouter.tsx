import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/layouts/AdminLayout";
import CorporateLayout from "@/layouts/CorporateLayout";
import TransportLayout from "@/layouts/TransportLayout";
import DepartmentLayout from "@/layouts/DepartmentLayout";
import DriverLayout from "@/layouts/DriverLayout";

export default function DashboardRouter() {
  const { profile, loading } = useAuth();

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  if (!profile) return <div className="p-6 text-sm text-red-600">No profile found</div>;

  switch (profile.system_role) {
    case "admin":
      return <AdminLayout />;
    case "corporate_approver":
      return <CorporateLayout />;
    case "transport_supervisor":
      return <TransportLayout />;
    case "driver":
      return <DriverLayout />;
    case "unit_head":
    case "staff":
    default:
      return <DepartmentLayout />;
  }
}