import { useEffect, useState } from "react";
import { API_BASE } from "../../../services/api";
import "./userstatus.css";

// ===== HÀM LẤY TÊN (từ cuối cùng) =====
const getLastName = (fullName) => {
  if (!fullName) return "";
  const parts = fullName.trim().split(" ");
  return parts[parts.length - 1].toLowerCase();
};

export default function UserStatus() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [keyword, setKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC");

  // ===== fetch users =====
  const fetchUsers = () => {
    fetch(`${API_BASE}/users`)
      .then((res) => res.json())
      .then(setUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== lock / unlock =====
  const toggleStatus = async (user) => {
    const newStatus = user.status === "active" ? "locked" : "active";

    await fetch(`${API_BASE}/users/${user.user_id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    fetchUsers();
  };

  // ===== filter + search + sort (THEO TÊN) =====
  const displayedUsers = users
    .filter((u) =>
      roleFilter === "ALL" ? true : u.role === roleFilter
    )
    .filter(
      (u) =>
        u.full_name.toLowerCase().includes(keyword.toLowerCase()) ||
        u.email.toLowerCase().includes(keyword.toLowerCase())
    )
    .sort((a, b) => {
      const nameA = getLastName(a.full_name);
      const nameB = getLastName(b.full_name);

      return sortOrder === "ASC"
        ? nameA.localeCompare(nameB, "vi") ||
            a.full_name.localeCompare(b.full_name, "vi")
        : nameB.localeCompare(nameA, "vi") ||
            b.full_name.localeCompare(a.full_name, "vi");
    });

  return (
    <div className="user-status-page">
      <h2>Khóa / Mở khóa tài khoản</h2>

      {/* ===== FILTER BAR ===== */}
      <div className="user-filter-bar">
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="ALL">Tất cả vai trò</option>
          <option value="ADMIN">Admin</option>
          <option value="LECTURER">Giảng viên</option>
          <option value="HOD">Trưởng bộ môn</option>
          <option value="AA">Phòng đào tạo</option>
          <option value="PRINCIPAL">Ban giám hiệu</option>
          <option value="STUDENT">Sinh viên</option>
        </select>

        <input
          type="text"
          placeholder="Tìm theo tên hoặc email..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="ASC">Tên A → Z</option>
          <option value="DESC">Tên Z → A</option>
        </select>
      </div>

      {/* ===== TABLE ===== */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map((u) => (
            <tr key={u.user_id} className={u.status === "locked" ? "locked" : ""}>
              <td>{u.full_name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.status === "active" ? "Đang hoạt động" : "Đã khóa"}
              </td>
              <td>
                <button onClick={() => toggleStatus(u)}>
                  {u.status === "active" ? "Khóa" : "Mở khóa"}
                </button>
              </td>
            </tr>
          ))}

          {displayedUsers.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                Không có người dùng phù hợp
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
