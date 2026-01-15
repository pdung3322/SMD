import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Header from "./header";
import Sidebar from "./sidebar";
import { normalizeRole, getCurrentUser } from "../services/layout";

import "../assets/layout.css";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
  }, [navigate]);

  if (!user) return null;

  return (
    <div className={`layout ${collapsed ? "sidebar-collapsed" : ""}`}>
      
      {/* SIDEBAR – FULL HEIGHT */}
      <Sidebar
        collapsed={collapsed}
        role={normalizeRole(user.role)}
        fullName={user.full_name}
      />

      {/* RIGHT SIDE */}
      <div className="layout-right">
        <Header onToggleSidebar={() => setCollapsed(!collapsed)} />

        <main className="main-content">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
