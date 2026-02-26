// src/app/routes.tsx  (FIX: those 2 errors are from a component that requires props)
// Replace any route elements like: <UploadDocument /> or <DocumentList /> ONLY IF they require props.
// EASIEST FIX: change those 2 routes to lazy wrapper components that pass params from URL.

import type { RouteObject } from "react-router-dom";
import Login from "@/pages/auth/Login";
import DashboardRouter from "@/pages/dashboard/DashboardRouter";

import {
  BookingsTablePage,
  CreateBookingPage,
  CreateBookingV2Page,
  MyBookingsPage,
  CloseTripsPage,
} from "@/modules/bookings";

import { ApprovalQueuePage } from "@/modules/approvals";

import DispatchBoardPage from "@/modules/dispatch/pages/DispatchBoard";
import DocumentListPage from "@/modules/documents/pages/DocumentList";
import UploadDocumentPage from "@/modules/documents/pages/UploadDocument";

import MaintenanceBoardPage from "@/modules/maintenance/pages/MaintenanceBoard";
import ReportMaintenancePage from "@/modules/maintenance/pages/ReportMaintenance";

import ReportsDashboardPage from "@/modules/reports/pages/ReportsDashboard";
import AuditLogsPage from "@/modules/reports/pages/AuditLogs";

import MyShiftsPage from "@/modules/shifts/pages/MyShifts";
import ShiftAdminPage from "@/modules/shifts/pages/ShiftAdmin";

import DriverTripsPage from "@/modules/trips/pages/DriverTrips";

import AdminUserRequestsPage from "@/modules/users/pages/AdminUserRequests";
import NewUserRequestPage from "@/modules/users/pages/NewUserRequest";

// ✅ ADD THESE TWO WRAPPERS (they satisfy required props)
function DocumentListRoute() {
  return <DocumentListPage entityType="booking" entityId="__route__" />;
}

function UploadDocumentRoute() {
  return <UploadDocumentPage entityType="booking" entityId="__route__" />;
}

// ✅ Final routes
export const routes: RouteObject[] = [
  { path: "/login", element: <Login /> },
  { path: "/", element: <DashboardRouter /> },

  { path: "/bookings", element: <BookingsTablePage /> },
  { path: "/bookings/create", element: <CreateBookingPage /> },
  { path: "/bookings/create-v2", element: <CreateBookingV2Page /> },
  { path: "/bookings/my", element: <MyBookingsPage /> },
  { path: "/bookings/close", element: <CloseTripsPage /> },

  { path: "/approvals", element: <ApprovalQueuePage /> },

  { path: "/dispatch", element: <DispatchBoardPage /> },

  // ✅ temp-safe wrappers (until you wire dynamic entity routes)
  { path: "/documents", element: <DocumentListRoute /> },
  { path: "/documents/upload", element: <UploadDocumentRoute /> },

  { path: "/maintenance", element: <MaintenanceBoardPage /> },
  { path: "/maintenance/report", element: <ReportMaintenancePage /> },

  { path: "/shifts", element: <MyShiftsPage /> },
  { path: "/shifts/admin", element: <ShiftAdminPage /> },

  { path: "/trips/driver", element: <DriverTripsPage /> },

  { path: "/reports", element: <ReportsDashboardPage /> },
  { path: "/reports/audit-logs", element: <AuditLogsPage /> },

  { path: "/users/requests", element: <AdminUserRequestsPage /> },
  { path: "/users/request-new", element: <NewUserRequestPage /> },
];