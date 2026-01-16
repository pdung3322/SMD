
// pages/hod/review/pending.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";  // ← IMPORT api
import { Link } from "react-router-dom";
import "./pending.css";

/* ===== STATUS MAP ===== */
const STATUS_LABEL = {
  ALL: "Tất cả",
  pending_review: "Chờ phản biện",  // ← Giữ nguyên
  pending_approval: "Chờ duyệt",  // ← Giữ nguyên
};

const STATUS_TABS = [
  { key: "ALL" },
  { key: "pending_review" },
  { key: "pending_approval" },
];

/**
 * PENDING (HOD)
 * - Danh sách đề cương "đang chờ HOD xử lý"
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
    // Lấy hod_id từ user đang login (tạm thời dùng 1, cần integrate auth sau)
    //const hod_id = 1; 

    //id 1014 là id test giáo trình
    const hod_id = 1014;  // TODO: lấy từ localStorage hoặc context

    api.get("/syllabus/pending", { params: { hod_id } })
      .then((res) => {
        setSyllabi(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Load pending syllabi error:", err);
        setError("Không thể tải danh sách đề cương. Vui lòng thử lại.");
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
      pending: filteredSyllabi.filter((s) => s.status === "pending_approval").length,
      approved: filteredSyllabi.filter((s) => s.status === "pending_review").length,
    };
  }, [filteredSyllabi]);

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
              placeholder="Tìm theo tên môn học, mã môn, giảng viên..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="pending-stats">
            <span className="stat-pill stat-total">Tổng: {quickStats.total}</span>
            <span className="stat-pill stat-pending">Chờ phản biện: {quickStats.pending}</span>
            <span className="stat-pill stat-approved">Chờ duyệt: {quickStats.approved}</span>
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
                      <div className="course-code">{s.course_code}</div>
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
                      {s.status === "pending_review" ? "Chờ phản biện" : "Chờ duyệt"}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/hod/review/evaluate/${s.syllabus_id}`}
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

