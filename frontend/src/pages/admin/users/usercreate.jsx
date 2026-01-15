import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./userdetail.css"; // tái dùng css cho đồng bộ

export default function UserCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    mobile: "",
    role: "STUDENT",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    if (!form.full_name || !form.email || !form.password) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    setSaving(true);

    axios
      .post("/users/create", form)
      .then(() => {
        alert("Tạo tài khoản thành công");
        navigate("/admin/users");
      })
      .catch((err) => {
        alert(err.response?.data?.detail || "Tạo tài khoản thất bại");
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="user-detail-page">
      <div className="user-detail-header">
        <h2>Tạo tài khoản người dùng</h2>
        <button onClick={() => navigate(-1)}>← Quay lại</button>
      </div>

      <div className="user-detail-card">
        <div className="form-group">
          <label>Họ tên</label>
          <input name="full_name" value={form.full_name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input name="mobile" value={form.mobile} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Người dùng</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="ADMIN">Quản trị hệ thống</option>
            <option value="HOD">Trưởng bộ môn</option>
            <option value="LECTURER">Giảng viên</option>
            <option value="AA">Phòng đào tạo</option>
            <option value="PRINCIPAL">Ban giám hiệu</option>
            <option value="STUDENT">Sinh viên</option>
          </select>
        </div>

        <div className="form-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="user-detail-actions">
          <button
            className="btn-primary"
            onClick={handleCreate}
            disabled={saving}
          >
            {saving ? "Đang tạo..." : "Tạo tài khoản"}
          </button>
        </div>
      </div>
    </div>
  );
}
