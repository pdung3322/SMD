import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";
import { Link } from "react-router-dom"; 
import "./userlist.css";
/* ===== ROLE MAP ===== */
const ROLE_LABEL = {
  ALL: "Tất cả",
  ADMIN: "Quản trị hệ thống",
  HOD: "Trưởng bộ môn",
  LECTURER: "Giảng viên",
  AA: "Phòng đào tạo",
  STUDENT: "Sinh viên",
  PRINCIPAL: "Ban giám hiệu",
};

const ROLE_TABS = [
  { key: "ALL" },
  { key: "ADMIN" },
  { key: "HOD" },
  { key: "LECTURER" },
  { key: "AA" },
  { key: "STUDENT" },
];

/* ===== COMPONENT ===== */
export default function UserList() {
  const [users, setUsers] = useState([]);
  const [activeRole, setActiveRole] = useState("ALL");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    api
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Load users error:", err));
  }, []);

  /* ===== ROLE COUNT ===== */
  const roleCounts = useMemo(() => {
    const counts = { ALL: users.length };
    users.forEach((u) => {
      counts[u.role] = (counts[u.role] || 0) + 1;
    });
    return counts;
  }, [users]);

  /* ===== FILTER USERS ===== */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = activeRole === "ALL" || u.role === activeRole;
      const matchStatus =
        statusFilter === "ALL" || u.status === statusFilter;

      const keyword = q.toLowerCase();
      const matchSearch =
        u.full_name.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword);

      return matchRole && matchStatus && matchSearch;
    });
  }, [users, activeRole, statusFilter, q]);

  /* ===== QUICK STATS ===== */
  const quickStats = useMemo(() => {
    return {
      total: filteredUsers.length,
      active: filteredUsers.filter((u) => u.status === "active").length,
      locked: filteredUsers.filter((u) => u.status !== "active").length,
    };
  }, [filteredUsers]);

  return (
    <div className="user-page">
      <h1 className="user-page-title">Danh sách người dùng</h1>

      {/* ===== ROLE TABS ===== */}
      <div className="role-tabs">
        {ROLE_TABS.map((t) => (
          <button
            key={t.key}
            className={`role-tab ${activeRole === t.key ? "active" : ""}`}
            onClick={() => setActiveRole(t.key)}
          >
            {ROLE_LABEL[t.key]}
          </button>
        ))}
      </div>

      {/* ===== FILTER ===== */}
      <div className="user-filter-card">
        <div className="user-filter-row">
          <div className="filter-group">
            <label>Tìm kiếm</label>
            <input
              placeholder="Tìm theo họ tên hoặc email..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="locked">Bị khóa</option>
            </select>
          </div>

          <div className="user-stats">
            <span className="stat-pill stat-total">
              Tổng: {quickStats.total}
            </span>
            <span className="stat-pill stat-active">
              Hoạt động: {quickStats.active}
            </span>
            <span className="stat-pill stat-locked">
              Bị khóa: {quickStats.locked}
            </span>
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="user-table-card">
        <table className="uth-table">
          <thead>
            <tr>
              <th className="col-stt">STT</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th style={{ width: 140 }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.user_id}> 
                <td className="col-stt">{index + 1}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`status ${user.status}`}>
                    {user.status === "active"
                      ? "Đang hoạt động"
                      : "Bị khóa"}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/admin/users/${user.user_id}`} 
                    className="btn-outline"
                  >
                    Chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
