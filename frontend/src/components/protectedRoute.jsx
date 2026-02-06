// ProtectedRoute.jsx
import { useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  // ❌ Chưa đăng nhập
  if (!user) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Chưa đăng nhập</h2>
        <p>Bạn cần đăng nhập để truy cập trang này.</p>
        <p><b>URL:</b> {location.pathname}</p>
      </div>
    );
  }

  // ❌ Sai quyền
  if (
    allowedRoles &&
    user.role &&
    !allowedRoles.includes(user.role.toUpperCase())
  ) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Không có quyền truy cập</h2>
        <p>
          Role hiện tại: <b>{user.role}</b>
        </p>
        <p>
          Quyền yêu cầu: <b>{allowedRoles.join(", ")}</b>
        </p>
        <p><b>URL:</b> {location.pathname}</p>
      </div>
    );
  }

  // ✅ OK
  return children;
}
