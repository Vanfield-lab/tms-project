import { useState } from "react";
import AppShell from "./AppShell";
import ReportsDashboard from "../pages/ReportsDashboard";
import AdminUserRequests from "../pages/AdminUserRequests";
import AuditLogs from "../pages/AuditLogs";

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