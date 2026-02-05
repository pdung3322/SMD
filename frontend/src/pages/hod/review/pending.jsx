import { useEffect, useMemo, useState } from "react";
import { getPendingSyllabus } from "../../../services/api";
import { getCurrentUser } from "../../../services/layout";
import { Link } from "react-router-dom";
import "./pending.css";

/* ===== STATUS MAP ===== */
const STATUS_LABEL = {
  ALL: "Tất cả",
  COLLABORATIVE_REVIEW: "Chờ phản biện",
  PENDING_HOD_REVIEW: "Chờ duyệt",
};

const STATUS_TABS = [
  { key: "ALL" },
  { key: "COLLABORATIVE_REVIEW" },
  { key: "PENDING_HOD_REVIEW" },
];

/**
 * PENDING (HOD)
 * - Danh sách giáo trình "đang chờ HOD xử lý"
 */
export default function Pending() {
  const [syllabi, setSyllabi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filters
  const [q, setQ] = useState("");
  const [activeStatus, setActiveStatus] = useState("ALL");

  /* ===== LOAD DATA TỪ API =====*/
  useEffect(() => {
    const currentUser = getCurrentUser();
    const hod_id = currentUser?.user_id ?? null;

    if (!hod_id) {
      setError("Không tìm thấy thông tin HOD. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    getPendingSyllabus(hod_id)
      .then((data) => {
        setSyllabi(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Load pending syllabi error:", err);
        setError("Không thể tải danh sách giáo trình. Vui lòng thử lại.");
        setLoading(false);
      });
  }, []);

  /* ===== STATUS COUNT ===== */
  const statusCounts = useMemo(() => {
    const counts = { ALL: syllabi.length };
    syllabi.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return counts;
  }, [syllabi]);

  /* ===== FILTER + SORT ===== */
  const filteredSyllabi = useMemo(() => {
    const keyword = q.trim().toLowerCase();

    const list = syllabi
      .filter((s) => {
        const matchStatus = activeStatus === "ALL" || s.status === activeStatus;
        const matchSearch =
          !keyword ||
          (s.course_name || "").toLowerCase().includes(keyword) ||
          (s.course_code || "").toLowerCase().includes(keyword) ||
          (s.lecturer_name || "").toLowerCase().includes(keyword);

        return matchStatus && matchSearch;
      })
      .sort((a, b) => {
        const da = new Date(a.submitted_date).getTime();
        const db = new Date(b.submitted_date).getTime();
        return db - da;
      });

    return list;
  }, [syllabi, q, activeStatus]);

  /* ===== QUICK STATS ===== */
  const quickStats = useMemo(() => {
    return {
      total: filteredSyllabi.length,
      pendingReview: filteredSyllabi.filter((s) => s.status === "COLLABORATIVE_REVIEW").length,
      pendingApproval: filteredSyllabi.filter((s) => s.status === "PENDING_HOD_REVIEW").length,
    };
  }, [filteredSyllabi]);

  const getStatusLabel = (st) => {
    const normalized = st === "PENDING" ? "pending_approval" : st;
    return STATUS_LABEL[normalized] || normalized || "—";
  };

  if (loading) return <div className="pending-page">Đang tải...</div>;
  if (error) return <div className="pending-page">{error}</div>;

  return (
    <div className="pending-page">
      <h1 className="pending-page-title">Giáo trình chờ duyệt</h1>

      {/* ===== STATUS TABS ===== */}
      <div className="status-tabs">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            className={`status-tab ${activeStatus === t.key ? "active" : ""}`}
            onClick={() => setActiveStatus(t.key)}
          >
            {STATUS_LABEL[t.key]}
          </button>
        ))}
      </div>

      {/* ===== FILTER ===== */}
      <div className="pending-filter-card">
        <div className="pending-filter-row">
          <div className="filter-group">
            <label>Tìm kiếm</label>
            <input
              placeholder="Tên giáo trình, mã giáo trình, giảng viên..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="pending-stats">
            <span className="stat-pill stat-total">Tổng: {quickStats.total}</span>
            <span className="stat-pill stat-pending">Chờ phản biện: {quickStats.pendingReview}</span>
            <span className="stat-pill stat-approved">Chờ duyệt: {quickStats.pendingApproval}</span>
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="pending-table-card">
        {filteredSyllabi.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">Không có giáo trình phù hợp.</div>
          </div>
        ) : (
          <table className="uth-table">
            <thead>
              <tr>
                <th className="col-stt">STT</th>
                <th>Giáo trình</th>
                <th>Giảng viên</th>
                <th>Ngày gửi</th>
                <th>Trạng thái</th>
                <th style={{ width: 240 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredSyllabi.map((s, index) => (
                <tr key={s.syllabus_id}>
                  <td className="col-stt">{index + 1}</td>
                  <td>
                    <div className="course-info">
                      <div className="course-name">{s.course_name}</div>
                    </div>
                  </td>
                  <td>{s.lecturer_name}</td>
                  <td>
                    {s.submitted_date
                      ? new Date(s.submitted_date).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td>
                    <span className={`status ${s.status}`}>
                      {getStatusLabel(s.status)}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/hod/review/detail/${s.syllabus_id}`}
                      className="btn-outline"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

