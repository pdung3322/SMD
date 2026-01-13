import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // Chưa login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Sai role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // OK
  return children;
}
