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
import SyllabusVersions from "./pages/admin/syllabus/syllabusversions";
import SyllabusStatus from "./pages/admin/syllabus/syllabusstatus";
import AcademicYearList from "./pages/admin/academic/academicyearlist";
import SemesterList from "./pages/admin/academic/semesterlist";
import CurrentSemester from "./pages/admin/academic/currentsemester";
import TrainingProgram from "./pages/admin/trainingprogram/trainingprogram";
import CourseRelations from "./pages/admin/course-relations/courserelations";

import LecturerDashboard from "./pages/lecturer/dashboard";
import LecturerSyllabusList from "./pages/lecturer/syllabuslist";
import LecturerSyllabusCreate from "./pages/lecturer/syllabuscreate";
import LecturerSyllabusEdit from "./pages/lecturer/syllabusedit";
import LecturerSyllabusDetail from "./pages/lecturer/syllabusdetail";
import LecturerSyllabusCompare from "./pages/lecturer/syllabuscompare";
import LecturerSyllabusApproval from "./pages/lecturer/syllabusapproval";
import LecturerComments from "./pages/lecturer/comments";
import LecturerCommentReply from "./pages/lecturer/commentreply";
import LecturerSyllabusUpdate from "./pages/lecturer/syllabusupdate";
import LecturerWorkflowChange from "./pages/lecturer/workflowchange";
import SyllabusStatusPage from "./pages/lecturer/syllabusstatuspage";
import WorkflowConfig from "./pages/admin/workflowconfig";
import WorkflowStatus from "./pages/admin/workflowstatus";
import SystemLogs from "./pages/admin/systemlogs";
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

        {/* USERS */}
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
        <Route path="/admin/users/permissions" element={<UserPermission />} />
        <Route path="/admin/users/status" element={<UserStatus />} />

        {/* SYLLABUS (NESTED – QUAN TRỌNG) */}
        <Route
          path="/admin/syllabus"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<SyllabusList />} />
          <Route path="versions" element={<SyllabusVersions />} />
        </Route>
<Route path="/admin/syllabus/status" element={<SyllabusStatus />} />
        {/* ACADEMIC */}
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
        <Route
          path="/admin/training-programs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <TrainingProgram />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/course-relations"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <CourseRelations />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/workflow" element={<WorkflowConfig />} />
        <Route path="/admin/workflow/status" element={<WorkflowStatus />} />
        <Route path="/admin/system-logs" element={<SystemLogs />} />

        {/* LECTURER */}
        <Route
          path="/lecturer"
          element={
            <ProtectedRoute allowedRoles={["LECTURER"]}>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<LecturerDashboard />} />
          <Route path="syllabuses" element={<LecturerSyllabusList />} />
          <Route path="syllabus/create" element={<LecturerSyllabusCreate />} />
          <Route path="syllabuses/:id" element={<LecturerSyllabusDetail />} />
          <Route path="syllabus/:id/edit" element={<LecturerSyllabusEdit />} />
          <Route path="syllabus/compare" element={<LecturerSyllabusCompare />} />
          <Route path="syllabus/approval" element={<LecturerSyllabusApproval />} />
          <Route path="comments" element={<LecturerComments />} />
          <Route path="comment-reply" element={<LecturerCommentReply />} />
          <Route path="syllabus-update" element={<LecturerSyllabusUpdate />} />
          <Route path="workflow-change" element={<LecturerWorkflowChange />} />
          <Route path="syllabus-status-test" element={<SyllabusStatusPage />} />
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

      {/* FALLBACK */}
      <Route path="*" element={<div>Page chưa tồn tại</div>} />

    </Routes>
  );
}
