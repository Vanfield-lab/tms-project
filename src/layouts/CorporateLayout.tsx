// src/layouts/CorporateLayout.tsx  (REPLACE TO REMOVE MISSING FuelApprovalQueue IMPORT)
import AppShell from "../app/AppShell";
import ApprovalQueue from "../modules/approvals/pages/ApprovalQueue";
import FuelReviewQueue from "../modules/fuel/pages/FuelReviewQueue";

export default function CorporateLayout() {
  return (
    <AppShell
      title="Corporate"
      navItems={[
        { label: "Booking Approvals", element: <ApprovalQueue /> },
        { label: "Fuel Approvals", element: <FuelReviewQueue /> },
      ]}
    />
  );
}