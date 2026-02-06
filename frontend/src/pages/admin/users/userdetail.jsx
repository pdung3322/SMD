import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./userdetail.css";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ===== LOAD USER ===== */
  useEffect(() => {
    axios
      .get(`/users/${id}`)
      .then((res) => setUser(res.data))
      .catch(() => alert("Không tìm thấy người dùng"))
      .finally(() => setLoading(false));
  }, [id]);

  /* ===== HANDLE CHANGE ===== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  /* ===== SAVE ===== */
  const handleSave = () => {
    setSaving(true);

    const payload = {
      full_name: user.full_name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    };

    // 👉 CHỈ gửi password nếu có nhập
    if (newPassword.trim() !== "") {
      payload.password = newPassword;
    }

    axios
      .put(`/users/${id}`, payload)
      .then(() => {
        alert("Cập nhật thành công");
        setNewPassword("");
      })
      .catch(() => alert("Cập nhật thất bại"))
      .finally(() => setSaving(false));
  };

  /* ===== LOCK / UNLOCK ===== */
  const toggleStatus = () => {
    const newStatus = user.status === "active" ? "locked" : "active";

    axios
      .patch(`/users/${id}/status`, { status: newStatus })
      .then(() =>
        setUser((prev) => ({ ...prev, status: newStatus }))
      )
      .catch(() => alert("Không thể cập nhật trạng thái"));
  };

  if (loading) return <p>Đang tải...</p>;
  if (!user) return null;

  return (
    <div className="user-detail-page">
      <div className="user-detail-header">
        <h2>Thông tin người dùng</h2>
        <button onClick={() => navigate(-1)}>← Quay lại</button>
      </div>

      <div className="user-detail-card">
        <div className="form-group">
          <label>Họ tên</label>
          <input
            name="full_name"
            value={user.full_name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            name="mobile"
            value={user.mobile || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Người dùng</label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
          >
            <option value="ADMIN">Quản trị hệ thống</option>
            <option value="HOD">Trưởng bộ môn</option>
            <option value="LECTURER">Giảng viên</option>
            <option value="AA">Phòng đào tạo</option>
            <option value="PRINCIPAL">Ban giám hiệu</option>
            <option value="STUDENT">Sinh viên</option>
          </select>
        </div>

        {/* ===== PASSWORD ===== */}
        <div className="form-group">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            placeholder="Để trống nếu không đổi"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="form-group form-group-status">
          <label>Trạng thái</label>
          <span
            className={`status-pill ${
              user.status === "active" ? "active" : "locked"
            }`}
          >
            {user.status === "active"
              ? "Đang hoạt động"
              : "Bị khóa"}
          </span>
        </div>

        <div className="user-detail-actions">
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>

          <button
            className="btn-danger"
            onClick={toggleStatus}
          >
            {user.status === "active"
              ? "Khóa tài khoản"
              : "Mở khóa tài khoản"}
          </button>
        </div>
      </div>
    </div>
  );
}
