import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import "./lookup.css";

/**
 * Lookup (HoD)
 * - Tra cứu & phân tích kho đề cương trong bộ môn
 * - API: GET /hod/syllabi?year=...&semester=...&major=...&q=...
 */

export default function Lookup() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [syllabi, setSyllabi] = useState([]);

    // Filters (đúng theo yêu cầu đề bài)
    const [year, setYear] = useState("2024-2025");
    const [semester, setSemester] = useState("HK1");
    const [q, setQ] = useState(""); // search by name/lecturer/faculty
    const [code, setCode] = useState(""); // search by syllabus code (course_code)

    useEffect(() => {
        const fetchSyllabi = async () => {
            try {
                setLoading(true);
                // API call với query params
                const params = {
                    year: year || undefined,
                    semester: semester || undefined,
                    q: q.trim() || undefined
                };

                const response = await api.get("/hod/syllabi", { params });

                // Transform API data to match UI structure
                const transformed = response.data.map(item => ({
                    id: item.id,
                    course_code: item.course_code || item.subject_code,
                    course_name: item.course_name,
                    faculty_name: item.faculty_name || "N/A",
                    major: item.major,
                    year: item.year,
                    semester: item.semester,
                    lecturer: item.lecturer_name || item.lecturer || "N/A",
                    current_version: item.current_version || "v1",
                    updated_at: item.updated_at,
                    status: item.status || "PENDING"
                }));

                setSyllabi(transformed);
            } catch (error) {
                console.error("Error fetching syllabi:", error);
                // Fallback to empty array on error
                setSyllabi([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSyllabi();
    }, [year, semester, q]);

    // Danh sách option
    const YEARS = ["2026-2027", "2025-2026", "2024-2025", "2023-2024", "2022-2023"];
    const SEMESTERS = ["HK1", "HK2"];

    const filtered = useMemo(() => {
        const keyword = q.trim().toLowerCase();
        const codeKey = code.trim().toLowerCase();

        return syllabi.filter((s) => {
            const matchYear = !year || !s.year || s.year === year;
            const matchSemester = !semester || !s.semester || s.semester === semester;

            const matchQ =
                keyword.length === 0 ||
                (s.course_name || "").toLowerCase().includes(keyword) ||
                (s.course_code || "").toLowerCase().includes(keyword) ||
                (s.lecturer || "").toLowerCase().includes(keyword) ||
                (s.faculty_name || "").toLowerCase().includes(keyword);

            const matchCode =
                codeKey.length === 0 ||
                (s.course_code || "").toLowerCase().includes(codeKey);

            return matchYear && matchSemester && matchQ && matchCode;
        });
    }, [syllabi, year, semester, q, code]);

    const statusBadge = (st) => {
        const map = {
            PENDING: { label: "Chờ duyệt", cls: "badge badge-pending" },
            APPROVED: { label: "Đã duyệt", cls: "badge badge-approved" },
            PUBLISHED: { label: "Đã công bố", cls: "badge badge-published" },
        };
        const x = map[st] || { label: st, cls: "badge" };
        return <span className={x.cls}>{x.label}</span>;
    };

    const handleReset = () => {
        setYear("2024-2025");
        setSemester("HK1");
        setQ("");
        setCode("");
    };

    if (loading) return <div className="lookup-page">Đang tải...</div>;

    return (
        <div className="lookup-page">
            <h1 className="lookup-title">📚 Tra cứu giáo trình</h1>
            <p className="lookup-description">
                Tìm kiếm các giáo trình đã được công bố.
            </p>

            {/* SEARCH CARD - AT TOP */}
            <div className="card card-search">
                <div className="search-wrapper">
                    <input
                        type="text"
                        className="search-input"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="🔍 Tìm theo mã - tên giáo trình - giảng viên..."
                    />
                </div>
            </div>

            {/* FILTERS BAR - INLINE */}
            <div className="filters-bar">
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
                    <label>Mã giáo trình</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="search-input"
                        placeholder="CNPM"
                    />
                </div>
                <button className="btn btn-ghost btn-sm btn-reset" onClick={handleReset}>
                    ↻ Đặt lại
                </button>
            </div>

            {/* RESULT TABLE */}
            <div className="card">
                <div className="card-head">
                    <div className="card-head-left">
                        <h3>Kết quả ({filtered.length})</h3>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty">
                        Không có giáo trình phù hợp bộ lọc hiện tại.
                    </div>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Mã giáo trình</th>
                                    <th>Tên môn</th>
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
                                        <td className="mono">{s.course_code}</td>
                                        <td>
                                            <div className="primary">{s.course_name}</div>
                                        </td>
                                        <td>{s.lecturer}</td>
                                        <td className="mono">{s.current_version}</td>
                                        <td>{s.updated_at ? new Date(s.updated_at).toLocaleDateString("vi-VN") : "—"}</td>
                                        <td>{statusBadge(s.status)}</td>
                                        <td>
                                            <div className="actions">
                                                {/* Xem chi tiết: điều hướng sang trang evaluate để xem & đánh giá */}
                                                <button
                                                    className="btn btn-sm btn-ghost"
                                                    onClick={() => navigate(`/hod/review/detail/${s.id}`)}
                                                    title="Xem và đánh giá đề cương"
                                                >
                                                    Xem chi tiết
                                                </button>
                                                <Link
                                                    className="btn btn-sm btn-primary"
                                                    to={`/hod/lookup/compare?syllabusId=${s.id}`}
                                                    title="So sánh phiên bản"
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
        </div>
    );
}
