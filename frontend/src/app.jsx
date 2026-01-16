import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Layout from "./components/layout";
import ProtectedRoute from "./components/protectedRoute";

import AdminDashboard from "./pages/admin/dashboard";
import UserList from "./pages/admin/users/userlist";
import UserDetail from "./pages/admin/users/userdetail";
import UserCreate from "./pages/admin/users/usercreate";
import UserImport from "./pages/admin/users/userimport";
import UserPermission from "./pages/admin/users/userpermission";
import UserStatus from "./pages/admin/users/userstatus";
import SyllabusList from "./pages/admin/syllabus/syllabuslist";

import Dashboard from "./pages/hod/dashboard";
import Pending from "./pages/hod/review/pending";
import Evaluate from "./pages/hod/review/evaluate";
import Clo from "./pages/hod/review/clo";
import Version from "./pages/hod/review/version";
import Decision from "./pages/hod/review/decision";

import CollaborativeReview from "./pages/hod/collaborative-review/collaborative";
import CollaborativeReviewIndex from "./pages/hod/collaborative-review/index";


import Lookup from "./pages/hod/lookup/lookup";
import Compare from "./pages/hod/lookup/compare";

import New from "./pages/hod/notifications/new";
import ReviewResult from "./pages/hod/notifications/reviewresult";
import Request from "./pages/hod/notifications/request";

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
        <Route
          path="/admin/users/create"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/import"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserImport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/permissions"
          element={<UserPermission />}
        />

        <Route
          path="/admin/users/status"
          element={<UserStatus />}
        />


        {/* HOD */}
        <Route
          path="/hod/dashboard"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* HOD PENDING REVIEW */}
        <Route
          path="/hod/review/pending"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <Pending />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hod/review/evaluate/:id"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <Evaluate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hod/review/clo/:id"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <Clo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hod/review/version/:id"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <Version />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hod/review/decision/:id"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <Decision />
            </ProtectedRoute>
          }
        />

        {/* HOD COLLABORATIVE-REVIEW */}
        <Route
          path="/hod/collaborative-review"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <CollaborativeReviewIndex />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hod/collaborative-review/:id"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <CollaborativeReview />
            </ProtectedRoute>
          }
        />

        {/* HOD LOOKUP */}
        <Route
          path="/hod/lookup/lookup"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <Lookup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hod/lookup/compare"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <Compare />
            </ProtectedRoute>
          }
        />

        {/* HOD NOTIFICATIONS */}
        <Route
          path="/hod/notifications/new"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <New />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hod/notifications/reviewresult"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <ReviewResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hod/notifications/request"
          element={
            <ProtectedRoute allowedRoles={["HOD"]}>
              <Request />
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
              <h1>PRINCIPAL PAGE</h1>
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
        <Route
          path="/admin/syllabus"
          element={<SyllabusList />}
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
