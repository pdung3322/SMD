import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));
    console.log("Hit here User role:", user.role, allowedRoles);

  // Chưa login
  if (!user) {
    return <Navigate to="/login" replace />;
  }


  // Sai role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("User role:", user.role);
    return <Navigate to="/login" replace />;
  }

  // OK
  console.log("Role passed:", user.role);
  return children;
}
