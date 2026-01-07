import { NavLink, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          padding: 24,
          borderRight: "1px solid #e5e7eb",
          background: "#fafafa",
        }}
      >
        <h2 style={{ marginBottom: 24 }}>Dashboard</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <NavLink to="/dashboard" end>Overview</NavLink>
          <NavLink to="/dashboard/enquiries">Enquiries</NavLink>
          <NavLink to="/dashboard/bookings">Bookings</NavLink>
          <NavLink to="/dashboard/billing">Billing</NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: 32 }}>
        <Outlet />
      </main>
    </div>
  );
}
