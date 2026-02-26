import { useState } from "react";
import AppShell from "../app/AppShell";
import ReportsDashboard from "../modules/reports/pages/ReportsDashboard";
import AdminUserRequests from "../modules/users/pages/AdminUserRequests";
import AuditLogs from "../modules/reports/pages/AuditLogs";

export default function AdminLayout() {
  const [page, setPage] = useState<"reports" | "users" | "audit">("reports");

  return (
    <AppShell
      title="Admin Dashboard"
      nav={[
        { label: "Reports", onClick: () => setPage("reports") },
        { label: "User Requests", onClick: () => setPage("users") },
        { label: "Audit Logs", onClick: () => setPage("audit") },
      ]}
    >
      {page === "reports" && <ReportsDashboard />}
      {page === "users" && <AdminUserRequests />}
      {page === "audit" && <AuditLogs />}
    </AppShell>
  );
}