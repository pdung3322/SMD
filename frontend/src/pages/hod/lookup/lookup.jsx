import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./lookup.css";

/**
 * Lookup (HoD)
 * - Mục tiêu: Tra cứu & phân tích kho đề cương trong bộ môn (không chỉ pending)
 * - Sau này thay mockData bằng API:
 *    GET /api/hod/syllabi?year=...&semester=...&major=...&status=...&q=...
 */

export default function Lookup() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [syllabi, setSyllabi] = useState([]);

    // Filters (đúng theo yêu cầu đề bài)
    const [year, setYear] = useState("2024-2025");
    const [semester, setSemester] = useState("HK1");
    const [major, setMajor] = useState("ALL");
    const [status, setStatus] = useState("ALL");
    const [q, setQ] = useState(""); // search by subject code/name/lecturer/keyword

    useEffect(() => {
        // ===== MOCK DATA (thay bằng API thật sau) =====
        const mockData = [
            {
                id: 101,
                subject_code: "MTH101",
                course_name: "Toán Cao Cấp",
                faculty_name: "Khoa Toán",
                major: "CNTT",
                year: "2024-2025",
                semester: "HK1",
                lecturer: "Nguyễn Văn Chiến",
                current_version: "v3",
                updated_at: "2026-01-05",
                status: "APPROVED", // APPROVED | PUBLISHED | ARCHIVED | DRAFT | PENDING
            },
            {
                id: 102,
                subject_code: "WEB201",
                course_name: "Lập Trình Web",
                faculty_name: "Khoa CNTT",
                major: "CNTT",
                year: "2024-2025",
                semester: "HK1",
                lecturer: "Trần Thị B",
                current_version: "v2",
                updated_at: "2026-01-02",
                status: "PUBLISHED",
            },
            {
                id: 103,
                subject_code: "SE301",
                course_name: "Công nghệ phần mềm",
                faculty_name: "Khoa CNTT",
                major: "KTPM",
                year: "2023-2024",
                semester: "HK2",
                lecturer: "Lê Văn C",
                current_version: "v1",
                updated_at: "2025-05-11",
                status: "APPROVED",
            },
        ];

        setSyllabi(mockData);
        setLoading(false);
    }, []);

    // Danh sách option (mock)
    const YEARS = ["2024-2025", "2023-2024", "2022-2023"];
    const SEMESTERS = ["HK1", "HK2", "HK3"];
    const MAJORS = ["ALL", "CNTT", "KTPM", "HTTT", "KHMT"];
    const STATUSES = ["ALL", "PENDING", "APPROVED", "PUBLISHED", "ARCHIVED", "DRAFT"];

    const filtered = useMemo(() => {
        const keyword = q.trim().toLowerCase();

        return syllabi.filter((s) => {
            const matchYear = !year || s.year === year;
            const matchSemester = !semester || s.semester === semester;
            const matchMajor = major === "ALL" || s.major === major;
            const matchStatus = status === "ALL" || s.status === status;

            const matchQ =
                keyword.length === 0 ||
                s.course_name.toLowerCase().includes(keyword) ||
                s.subject_code.toLowerCase().includes(keyword) ||
                s.lecturer.toLowerCase().includes(keyword) ||
                s.faculty_name.toLowerCase().includes(keyword);

            return matchYear && matchSemester && matchMajor && matchStatus && matchQ;
        });
    }, [syllabi, year, semester, major, status, q]);

    const statusBadge = (st) => {
        const map = {
            PENDING: { label: "Chờ duyệt", cls: "badge badge-pending" },
            APPROVED: { label: "Đã duyệt", cls: "badge badge-approved" },
            PUBLISHED: { label: "Đã công bố", cls: "badge badge-published" },
            ARCHIVED: { label: "Lưu trữ", cls: "badge badge-archived" },
            DRAFT: { label: "Nháp", cls: "badge badge-draft" },
        };
        const x = map[st] || { label: st, cls: "badge" };
        return <span className={x.cls}>{x.label}</span>;
    };

    const handleReset = () => {
        setYear("2024-2025");
        setSemester("HK1");
        setMajor("ALL");
        setStatus("ALL");
        setQ("");
    };

    if (loading) return <div className="lookup-page">Đang tải...</div>;

    return (
        <div className="lookup-page">
            <div className="lookup-header">
                <div>
                    <h1 className="lookup-title">Tra cứu đề cương theo năm học & chuyên ngành</h1>
                    <p className="lookup-subtitle">
                        Dùng để tra cứu kho đề cương trong bộ môn theo năm học/học kỳ/ngành và đảm bảo tính nhất quán giữa các phiên bản.
                    </p>
                </div>

                <button className="btn btn-ghost" onClick={handleReset}>
                    Đặt lại bộ lọc
                </button>
            </div>

            {/* FILTER CARD */}
            <div className="card">
                <div className="filter-grid">
                    <div className="field">
                        <label>Năm học</label>
                        <select value={year} onChange={(e) => setYear(e.target.value)}>
                            {YEARS.map((y) => (
                                <option value={y} key={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label>Học kỳ</label>
                        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
                            {SEMESTERS.map((s) => (
                                <option value={s} key={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label>Ngành/Chuyên ngành</label>
                        <select value={major} onChange={(e) => setMajor(e.target.value)}>
                            {MAJORS.map((m) => (
                                <option value={m} key={m}>
                                    {m === "ALL" ? "Tất cả" : m}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label>Trạng thái</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            {STATUSES.map((st) => (
                                <option value={st} key={st}>
                                    {st === "ALL" ? "Tất cả" : st}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field field-wide">
                        <label>Tìm kiếm</label>
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Tìm theo mã môn / tên môn / giảng viên / khoa..."
                        />
                    </div>
                </div>
            </div>

            {/* RESULT TABLE */}
            <div className="card">
                <div className="card-head">
                    <div className="card-head-left">
                        <h3>Kết quả ({filtered.length})</h3>
                        <p className="muted">
                            * Đây là kho tra cứu (có thể bao gồm đề cương đã duyệt, đã công bố, các năm trước).
                        </p>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty">
                        Không có đề cương phù hợp bộ lọc hiện tại.
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Mã môn</th>
                                    <th>Tên môn</th>
                                    <th>Ngành</th>
                                    <th>Giảng viên</th>
                                    <th>Phiên bản</th>
                                    <th>Cập nhật</th>
                                    <th>Trạng thái</th>
                                    <th style={{ width: 220 }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((s) => (
                                    <tr key={s.id}>
                                        <td className="mono">{s.subject_code}</td>
                                        <td>
                                            <div className="primary">{s.course_name}</div>
                                            <div className="muted small">{s.faculty_name} • {s.year} • {s.semester}</div>
                                        </td>
                                        <td>{s.major}</td>
                                        <td>{s.lecturer}</td>
                                        <td className="mono">{s.current_version}</td>
                                        <td>{new Date(s.updated_at).toLocaleDateString()}</td>
                                        <td>{statusBadge(s.status)}</td>
                                        <td>
                                            <div className="actions">
                                                {/* Xem chi tiết: demo tạm điều hướng sang evaluate (sau thay bằng trang detail) */}
                                                <button
                                                    className="btn btn-ghost"
                                                    onClick={() => navigate(`/hod/review/evaluate/${s.id}`)}
                                                    title="Tạm link qua Evaluate để demo (sau sẽ có trang detail riêng)"
                                                >
                                                    Xem chi tiết
                                                </button>

                                                {/* Compare: mang theo syllabusId qua compare */}
                                                <Link
                                                    className="btn btn-primary"
                                                    to={`/hod/compare?syllabusId=${s.id}`}
                                                    title="So sánh phiên bản của đề cương này"
                                                >
                                                    So sánh
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

            <div className="hint">
                Gợi ý: Từ trang này, HoD có thể tra cứu đề cương theo năm/ngành để đối chiếu, sau đó bấm <b>So sánh</b> để kiểm tra thay đổi giữa các phiên bản.
            </div>
        </div>
    );
}
