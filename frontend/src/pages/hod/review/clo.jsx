import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./clo.css";


export default function Clo() {
    const { id } = useParams();

    const [syllabus, setSyllabus] = useState(null);
    const [clos, setClos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // filters
    const [q, setQ] = useState("");
    const [levelFilter, setLevelFilter] = useState("ALL");

    useEffect(() => {

        const mockSyllabus = {
            id,
            course_code: "WEB201",
            course_name: "Lập Trình Web",
            faculty_name: "Khoa CNTT",
            version: "v1",
            submitted_date: "2026-01-02",
        };

        const mockCLOs = [
            {
                clo_code: "CLO1",
                description: "Trình bày được kiến thức nền tảng về Web/HTTP.",
                level: "K1",
                status: "ok",
                note: "",
            },
            {
                clo_code: "CLO2",
                description: "Xây dựng được giao diện web bằng HTML/CSS/JS.",
                level: "K2",
                status: "warning",
                note: "Mô tả hơi rộng, nên cụ thể hóa tiêu chí đánh giá.",
            },
            {
                clo_code: "CLO3",
                description:
                    "Thiết kế và triển khai một web app có CRUD và xác thực cơ bản.",
                level: "K3",
                status: "ok",
                note: "",
            },
            {
                clo_code: "CLO4",
                description: "Liên kết CLO với PLO phù hợp và có minh chứng.",
                level: "K2",
                status: "error",
                note: "Thiếu mapping CLO–PLO hoặc mapping chưa đầy đủ.",
            },
        ];

        setSyllabus(mockSyllabus);
        setClos(mockCLOs);
        setLoading(false);

    }, [id]);

    const filteredCLOs = useMemo(() => {
        const keyword = q.trim().toLowerCase();

        return clos.filter((c) => {
            const matchLevel = levelFilter === "ALL" || c.level === levelFilter;
            const matchSearch =
                !keyword ||
                (c.clo_code || "").toLowerCase().includes(keyword) ||
                (c.description || "").toLowerCase().includes(keyword);

            return matchLevel && matchSearch;
        });
    }, [clos, q, levelFilter]);

    const badgeClass = (status) => {
        if (status === "ok") return "badge badge-ok";
        if (status === "warning") return "badge badge-warn";
        if (status === "error") return "badge badge-err";
        return "badge";
    };

    const badgeText = (status) => {
        if (status === "ok") return "Ổn";
        if (status === "warning") return "Cần rà soát";
        if (status === "error") return "Thiếu / Sai";
        return status || "—";
    };

    if (loading) return <div className="clo-page">Đang tải...</div>;
    if (error) return <div className="clo-page">{error}</div>;
    if (!syllabus) return <div className="clo-page">Không tìm thấy đề cương.</div>;

    return (
        <div className="clo-page">
            {/* ===== HEADER ===== */}
            <div className="clo-header">
                <div>
                    <h1 className="clo-title">
                        Kiểm tra CLO — {syllabus.course_name}
                    </h1>
                    <p className="clo-subtitle">
                        Mục tiêu: kiểm tra mô tả CLO rõ ràng, đúng mức độ, và sẵn sàng cho bước
                        xem thay đổi phiên bản.
                    </p>
                </div>

                <div className="clo-top-actions">
                    {/* Điều hướng theo luồng */}
                    <Link to={`/hod/review/evaluate/${id}`} className="btn btn-ghost">
                        ← Nội dung
                    </Link>
                    <Link to={`/hod/review/version/${id}`} className="btn btn-primary">
                        Tiếp theo: Version →
                    </Link>
                </div>
            </div>

            {/* ===== INFO CARD ===== */}
            <div className="clo-info-card">
                <div className="info-item">
                    <div className="info-label">Mã môn</div>
                    <div className="info-value">{syllabus.course_code}</div>
                </div>
                <div className="info-item">
                    <div className="info-label">Khoa</div>
                    <div className="info-value">{syllabus.faculty_name}</div>
                </div>
                <div className="info-item">
                    <div className="info-label">Phiên bản</div>
                    <div className="info-value">{syllabus.version}</div>
                </div>
                <div className="info-item">
                    <div className="info-label">Ngày nộp</div>
                    <div className="info-value">
                        {new Date(syllabus.submitted_date).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* ===== FILTER ===== */}
            <div className="clo-filter-card">
                <div className="filter-group">
                    <label>Tìm kiếm CLO</label>
                    <input
                        placeholder="CLO1, mô tả, từ khóa..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label>Mức độ</label>
                    <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                    >
                        <option value="ALL">Tất cả</option>
                        <option value="K1">K1</option>
                        <option value="K2">K2</option>
                        <option value="K3">K3</option>
                    </select>
                </div>
            </div>

            {/* ===== LIST ===== */}
            <div className="clo-list-wrap">
                {filteredCLOs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-title">Không có CLO phù hợp.</div>
                        <div className="empty-sub">Thử đổi bộ lọc hoặc từ khóa.</div>
                    </div>
                ) : (
                    <table className="clo-table">
                        <thead>
                            <tr>
                                <th>CLO</th>
                                <th>Mức độ</th>
                                <th>Mô tả</th>
                                <th>Trạng thái</th>
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCLOs.map((c) => (
                                <tr key={c.clo_code}>
                                    <td className="col-code">{c.clo_code}</td>
                                    <td>{c.level}</td>
                                    <td className="col-desc">{c.description}</td>
                                    <td>
                                        <span className={badgeClass(c.status)}>
                                            {badgeText(c.status)}
                                        </span>
                                    </td>
                                    <td className="col-note">{c.note || "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ===== FOOT NOTE ===== */}
            <div className="clo-note">
                TODO (backend): trang này sau sẽ có thêm mapping CLO–PLO và validate tự động.
            </div>
        </div>
    );
}
