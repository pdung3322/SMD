import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Layout from "./components/layout";
import ProtectedRoute from "./components/protectedRoute";

import AdminDashboard from "./pages/admin/dashboard";
import UserList from "./pages/admin/users/userlist";
import UserDetail from "./pages/admin/users/userdetail";

import PrincipalDashboard from "./pages/principal/PrincipalDashboard";
import FinalApproval from "./pages/principal/pheduyet/FinalApproval";
import ApprovedSyllabus from "./pages/principal/pheduyet/ApprovedSyllabus";
import SystemHealth from "./pages/principal/giamsathethong/SystemHealth";
import AAReport from "./pages/principal/giamsathethong/AAReport";
import KpiMonitoring from "./pages/principal/giamsathethong/KpiMonitoring";
import Notifications from "./pages/principal/thongbao/notifications";

export default function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* LAYOUT */}
      <Route element={<Layout />}>
        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* USER LIST */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserList />
            </ProtectedRoute>
          }
        />

        {/* USER DETAIL */}
        <Route
          path="/admin/users/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserDetail />
            </ProtectedRoute>
          }
        />

        {/* HOD */}
        <Route
          path="/hod"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <h1>HOD PAGE</h1>
            </ProtectedRoute>
          }
        />

        {/* AA */}
        <Route
          path="/aa"
          element={
            <ProtectedRoute allowedRoles={["AA"]}>
              <h1>AA PAGE</h1>
            </ProtectedRoute>
          }
        />

        {/* PRINCIPAL */}
        <Route
          path="/principal"
          element={
            <ProtectedRoute allowedRoles={["PRINCIPAL"]}>
              <PrincipalDashboard/>
            </ProtectedRoute>
          }
        />

        {/* PRINCIPAL */}
        <Route
          path="/principal/FinalApproval"
          element={
            <ProtectedRoute allowedRoles={["PRINCIPAL"]}>
              <FinalApproval/>
            </ProtectedRoute>
          }
        />

        {/* PRINCIPAL */}
        <Route
          path="/principal/ApprovedSyllabus"
          element={
            <ProtectedRoute allowedRoles={["PRINCIPAL"]}>
              <ApprovedSyllabus/>
            </ProtectedRoute>
          }
        />
        {/* PRINCIPAL */}
        <Route
          path="/principal/SystemHealth"
          element={
            <ProtectedRoute allowedRoles={["PRINCIPAL"]}>
              <SystemHealth/>
            </ProtectedRoute>
          }
        />

        {/* PRINCIPAL */}
        <Route
          path="/principal/AAReport"
          element={
            <ProtectedRoute allowedRoles={["PRINCIPAL"]}>
              <AAReport/>
            </ProtectedRoute>
          }
        />

        {/* PRINCIPAL */}
        <Route
          path="/principal/KpiMonitoring"
          element={
            <ProtectedRoute allowedRoles={["PRINCIPAL"]}>
              <KpiMonitoring/>
            </ProtectedRoute>
          }
        />

        {/* PRINCIPAL */}
        <Route
          path="/principal/notifications"
          element={
            <ProtectedRoute allowedRoles={["PRINCIPAL"]}>
              <Notifications/>
            </ProtectedRoute>
          }
        />

        {/* LECTURER */}
        <Route
          path="/lecturer"
          element={
            <ProtectedRoute allowedRoles={["LECTURER"]}>
              <h1>LECTURER PAGE</h1>
            </ProtectedRoute>
          }
        />

        {/* STUDENT */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <h1>STUDENT PAGE</h1>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* DEFAULT */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
