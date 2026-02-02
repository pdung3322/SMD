import { Routes, Route, Navigate, Outlet } from "react-router-dom";

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
import LecturerSyllabusList from "./pages/lecturer/syllabuslist";
import LecturerSyllabusCreate from "./pages/lecturer/syllabuscreate";
import LecturerSyllabusEdit from "./pages/lecturer/syllabusedit";
import AcademicYearList from "./pages/admin/academic/academicyearlist";
import SemesterList from "./pages/admin/academic/semesterlist";
import CurrentSemester from "./pages/admin/academic/currentsemester";
import LecturerDashboard from "./pages/lecturer/dashboard";

export default function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* LAYOUT */}
      <Route element={<Layout />}>
        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserList />
            </ProtectedRoute>
          }
        />

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

        <Route
          path="/admin/syllabus"
          element={<SyllabusList />}
        />

        {/* ADMIN - ACADEMIC */}
<Route
  path="/admin/academic-years"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AcademicYearList />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/semesters"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <SemesterList />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/current-semester"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <CurrentSemester />
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
              <h1>PRINCIPAL PAGE</h1>
            </ProtectedRoute>
          }
        />

        {/* LECTURER */}
    <Route
  path="/lecturer"
  element={
    <ProtectedRoute allowedRoles={["LECTURER"]}>
      <Outlet />
    </ProtectedRoute>
  }
>
  {/* DASHBOARD */}
  <Route index element={<LecturerDashboard />} />

  {/* SYLLABUS */}
  <Route path="syllabuses" element={<LecturerSyllabusList />} />
  <Route path="syllabus/create" element={<LecturerSyllabusCreate />} />
  <Route path="syllabus/:id/edit" element={<LecturerSyllabusEdit />} />
</Route>


         

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
