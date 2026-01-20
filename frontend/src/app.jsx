import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Layout from "./components/layout";
import ProtectedRoute from "./components/protectedRoute";

import AdminDashboard from "./pages/admin/dashboard";
import UserList from "./pages/admin/users/userlist";
import UserDetail from "./pages/admin/users/userdetail";
import UserCreate from "./pages/admin/users/usercreate";

// Student
import StudentDashboard from "./pages/student/dashboard/dashboard";
import CourseOverview from "./pages/student/course_overview";
import StudentDetailSubjectTree from "./pages/student/detail/subject-tree";
import StudentSubscribeNotifications from "./pages/student/subscribe/notifications";
import StudentFeedbackReport from "./pages/student/feedback/report";
import StudentSearchBySubjectName from "./pages/student/search/by-subject-name";
import StudentSearchByCode from "./pages/student/search/by-subject-code";
import StudentSearchByMajorSemester from "./pages/student/search/by-major-semester";

// Academic Affairs
import AcademicAffairsDashboard from "./pages/academic_affairs/dashboard";
import PendingApprovals from "./pages/academic_affairs/approval/pending";
import PloCheck from "./pages/academic_affairs/approval/plo-check";
import EvaluateSyllabus from "./pages/academic_affairs/approval/evaluate";
import ApprovalDecision from "./pages/academic_affairs/approval/pending";
import PloManagement from "./pages/academic_affairs/program/plo-management";
import ProgramStructure from "./pages/academic_affairs/program/program-structure";
import ProgramCourses from "./pages/academic_affairs/program/program-courses";
import LookupBySemester from "./pages/academic_affairs/lookup/lookup-by-semester";
import CompareSyllabus from "./pages/academic_affairs/lookup/compare-syllabus";
import ApprovalResult from "./pages/academic_affairs/notification/approval-result";
import RejectedOrEdit from "./pages/academic_affairs/notification/rejected-or-edit";
import RequestSupport from "./pages/academic_affairs/support/request-support";
import BugFeedback from "./pages/academic_affairs/support/bug-feedback";
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

        {/* ACADEMIC AFFAIRS DASHBOARD */}
        <Route
          path="/academic_affairs/dashboard"
          element={
            <ProtectedRoute allowedRoles={["AA"]}>
              <AcademicAffairsDashboard />
            </ProtectedRoute>
          }
        />

        {/* PENDING APPROVALS */}
        <Route
          path="/academic_affairs/approval/pending"
          element={
            <ProtectedRoute allowedRoles={["AA"]}>
              <PendingApprovals />
            </ProtectedRoute>
          }
        />

        {/* PLO CHECK */}
        <Route
          path="/academic_affairs/approval/plo-check"
          element={
            <ProtectedRoute allowedRoles={["AA"]}>
              <PloCheck />
            </ProtectedRoute>
          }
        />

        {/* EVALUATE SYLLABUS */}
        <Route
          path="/academic_affairs/approval/evaluate"
          element={
            <ProtectedRoute allowedRoles={["AA"]}>
              <EvaluateSyllabus />
            </ProtectedRoute>
          }
        />

        {/* PLO MANAGEMENT */}
        <Route
          path="/academic_affairs/program/plo-management"
          element={
            <ProtectedRoute allowedRoles={["AA"]}>
              <PloManagement />
            </ProtectedRoute>
          }
        />

        {/* PROGRAM STRUCTURE */}
        <Route
          path="/academic_affairs/program/program-structure"
          element={
            <ProtectedRoute allowedRoles={["AA"]}>
              <ProgramStructure />
            </ProtectedRoute>
          }
        />

        {/* PROGRAM COURSES */}
        <Route
          path="/academic_affairs/program/program-courses"
          element={
            <ProtectedRoute allowedRoles={["AA"]}>
              <ProgramCourses />
            </ProtectedRoute>
          }
        />

        {/* LOOKUP BY SEMESTER */}
        <Route
          path="/academic_affairs/lookup/lookup-by-semester"
          element={
            <ProtectedRoute allowedRoles={["AA"]}>
              <LookupBySemester />
            </ProtectedRoute>
          }
        />

        {/* COMPARE SYLLABUS */}
        <Route
          path="/academic_affairs/lookup/compare-syllabus"
          element={
            <ProtectedRoute allowedRoles={["AA"]}>
              <CompareSyllabus />
            </ProtectedRoute>
          }
        />

        {/* APPROVAL RESULT */}
        <Route
          path="/academic_affairs/notification/approval-result"
          element={
            <ProtectedRoute allowedRoles={["AA"]}>
              <ApprovalResult />
            </ProtectedRoute>
          }
        />

        {/* REJECTED OR EDIT */}
        <Route
          path="/academic_affairs/notification/rejected-or-edit"
          element={
            <ProtectedRoute allowedRoles={["AA"]}>
              <RejectedOrEdit />
            </ProtectedRoute>
          }
        />

        {/* REQUEST SUPPORT */}
        <Route
          path="/academic_affairs/support/request-support"
          element={
            <ProtectedRoute allowedRoles={["AA"]}>
              <RequestSupport />
            </ProtectedRoute>
          }
        />

        {/* BUG FEEDBACK */}
        <Route
          path="/academic_affairs/support/bug-feedback"
          element={
            <ProtectedRoute allowedRoles={["AA"]}>
              <BugFeedback />
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
        {/* ================= STUDENT ================= */}

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <CourseOverview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/search/by-subject-name"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentSearchBySubjectName />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/search/by-subject-code"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentSearchByCode />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/search/by-major-semester"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentSearchByMajorSemester />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/detail/subject-tree"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentDetailSubjectTree />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/subscribe/notifications"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentSubscribeNotifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/feedback/report"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentFeedbackReport />
            </ProtectedRoute>
          }
        />


      </Route>
      {/* DEFAULT */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
