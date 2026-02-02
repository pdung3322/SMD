import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./current-semester.css";
import api from "../../../services/api";

export default function CurrentSemester() {
  const [semester, setSemester] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentSemester();
  }, []);

  const fetchCurrentSemester = async () => {
    try {
      const res = await api.get("/academic/current-semester");
      setSemester(res.data);
    } catch (err) {
      setSemester(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Đang tải học kỳ hiện hành...</p>;
  if (!semester)
    return <p>Hiện tại chưa thiết lập học kỳ hiện hành</p>;

  return (
    <div className="current-semester-page">
      <h1 className="page-title">Học kỳ hiện hành</h1>

      <div className="current-semester-box">
        <div className="current-semester-row">
          <div className="current-semester-label">Học kỳ</div>
          <div className="current-semester-value">
            {semester.name}
          </div>
        </div>

        <div className="current-semester-row">
          <div className="current-semester-label">Thời gian</div>
          <div className="current-semester-value">
            {semester.start_date} – {semester.end_date}
          </div>
        </div>

        <div className="current-semester-row">
          <div className="current-semester-label">Tính chất</div>
          <div className="current-semester-value">
            {semester.is_optional ? "Không bắt buộc" : "Bắt buộc"}
          </div>
        </div>

        <span className="current-semester-status active">
          HỌC KỲ HIỆN HÀNH (DO ADMIN THIẾT LẬP)
        </span>

        <div className="current-semester-note">
          * Trang này hiển thị trạng thái học kỳ mà hệ thống đang áp dụng.
        </div>

        {/* ===== ACTIONS (MỨC 2) ===== */}
        <div className="current-semester-actions">
          <Link to="/admin/semesters" className="btn-secondary">
            Thay đổi học kỳ hiện hành
          </Link>
        </div>
      </div>
    </div>
  );
}
