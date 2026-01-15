
// pages/hod/review/pending.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./pending.css";


export default function Pending() {
  const [syllabi, setSyllabi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {

    const mockData = [
      {
        id: 1,
        course_code: "MTH101",
        course_name: "Toán Cao Cấp",
        faculty_name: "Khoa Toán",
        lecturer_name: "Nguyễn Văn A",
        submitted_date: "2026-01-01",
        status: "pending_review",
        version: "v2",
        due_date: "2026-01-10",
      },
      {
        id: 2,
        course_code: "WEB201",
        course_name: "Lập Trình Web",
        faculty_name: "Khoa CNTT",
        lecturer_name: "Trần Thị B",
        submitted_date: "2026-01-02",
        status: "pending_review",
        version: "v1",
        due_date: "2026-01-12",
      },
      {
        id: 3,
        course_code: "DBI202",
        course_name: "Cơ Sở Dữ Liệu",
        faculty_name: "Khoa CNTT",
        lecturer_name: "Lê Văn C",
        submitted_date: "2026-01-03",
        status: "pending_approval",
        version: "v3",
        due_date: "2026-01-15",
      },
    ];

    setSyllabi(mockData);
    setLoading(false);

  }, []);

  const filteredSyllabi = useMemo(() => {
    const keyword = q.trim().toLowerCase();

    const list = syllabi
      .filter((s) => {
        const matchStatus =
          statusFilter === "ALL" || s.status === statusFilter;

        const matchSearch =
          !keyword ||
          (s.course_name || "").toLowerCase().includes(keyword) ||
          (s.course_code || "").toLowerCase().includes(keyword) ||
          (s.faculty_name || "").toLowerCase().includes(keyword) ||
          (s.lecturer_name || "").toLowerCase().includes(keyword);

        return matchStatus && matchSearch;
      })
      .sort((a, b) => {
        const da = new Date(a.submitted_date).getTime();
        const db = new Date(b.submitted_date).getTime();
        return db - da;
      });

    return list;
  }, [syllabi, q, statusFilter]);

  const badgeText = (status) => {
    switch (status) {
      case "pending_review":
        return "Chờ phản biện";
      case "pending_approval":
        return "Chờ HOD duyệt";
      default:
        return status || "—";
    }
  };

  const badgeClass = (status) => {
    switch (status) {
      case "pending_review":
        return "badge badge-warn";
      case "pending_approval":
        return "badge badge-info";
      default:
        return "badge";
    }
  };

  if (loading) return <div className="pending-page">Đang tải...</div>;
  if (error) return <div className="pending-page">{error}</div>;

  return (
    <div className="pending-page">
      {/* ===== HEADER ===== */}
      <div className="pending-header">
        <h1 className="pending-title">Đề cương chờ duyệt</h1>
      </div>

      <div className="pending-filter-card">
        <div className="pending-filter-row">
          <div className="filter-group">
            <label>Tìm kiếm</label>
            <input
              placeholder="Tìm theo họ tên, email..."
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
              <option value="pending_review">Chờ phản biện</option>
              <option value="pending_approval">Chờ HOD duyệt</option>
            </select>
          </div>

        </div>
      </div>

      <div className="pending-list">
        {filteredSyllabi.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">Không có đề cương phù hợp.</div>
            <div className="empty-sub">
              Thử đổi bộ lọc hoặc từ khóa tìm kiếm.
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="pending-table">
              <thead>
                <tr>
                  <th>Môn học</th>
                  <th>Người tạo</th>
                  <th>Ngày gửi</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredSyllabi.map((s) => (
                  <tr key={s.id}>
                    <td className="col-course">
                      <div className="course-name">{s.course_name}</div>
                    </td>
                    <td>{s.lecturer_name}</td>
                    <td>
                      {s.submitted_date
                        ? new Date(s.submitted_date).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                    <td>
                      <span className="badge-pending">
                        Chờ duyệt
                      </span>
                    </td>

                    <td className="col-actions">
                      <div className="actions">
                        <Link
                          to={`/hod/review/evaluate/${s.id}`}
                          className="action-link"
                          title="Xem chi tiết"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

