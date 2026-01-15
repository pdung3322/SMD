import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./version.css";

export default function Version() {
    const { id } = useParams();

    const [meta, setMeta] = useState(null);
    const [diffRows, setDiffRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // filter
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [q, setQ] = useState("");

    useEffect(() => {
        const mockMeta = {
            syllabus_id: id,
            course_name: "Lập Trình Web",
            from_version: "v0",
            to_version: "v1",
            generated_at: "2026-01-05",
        };

        const mockDiff = [
            {
                id: 1,
                section: "Mục tiêu môn học",
                type: "changed",
                before: "Nắm kiến thức web cơ bản.",
                after: "Nắm kiến thức web cơ bản + thực hành xây dựng web app.",
            },
            {
                id: 2,
                section: "CLO",
                type: "added",
                before: "",
                after: "CLO4: Liên kết CLO với PLO phù hợp và có minh chứng.",
            },
            {
                id: 3,
                section: "Đánh giá",
                type: "changed",
                before: "Giữa kỳ 30%, Cuối kỳ 70%",
                after: "Giữa kỳ 40%, Cuối kỳ 60%",
            },
            {
                id: 4,
                section: "Tài liệu tham khảo",
                type: "removed",
                before: "Giáo trình cũ 2018 (PDF)",
                after: "",
            },
        ];

        setMeta(mockMeta);
        setDiffRows(mockDiff);
        setLoading(false);
    }, [id]);

    const filteredDiff = useMemo(() => {
        const keyword = q.trim().toLowerCase();

        return diffRows.filter((r) => {
            const matchType = typeFilter === "ALL" || r.type === typeFilter;
            const matchSearch =
                !keyword ||
                (r.section || "").toLowerCase().includes(keyword) ||
                (r.before || "").toLowerCase().includes(keyword) ||
                (r.after || "").toLowerCase().includes(keyword);

            return matchType && matchSearch;
        });
    }, [diffRows, typeFilter, q]);

    const typeBadgeClass = (type) => {
        if (type === "added") return "badge badge-ok";
        if (type === "changed") return "badge badge-warn";
        if (type === "removed") return "badge badge-err";
        return "badge";
    };

    const typeText = (type) => {
        if (type === "added") return "Thêm";
        if (type === "changed") return "Sửa";
        if (type === "removed") return "Xóa";
        return type || "—";
    };

    if (loading) return <div className="version-page">Đang tải...</div>;
    if (error) return <div className="version-page">{error}</div>;
    if (!meta) return <div className="version-page">Không có dữ liệu.</div>;

    return (
        <div className="version-page">
            <div className="version-header">
                <div>
                    <h1 className="version-title">
                        Thay đổi phiên bản — {meta.course_name}
                    </h1>
                    <p className="version-subtitle">
                        Xem nhanh những phần được thêm/sửa/xóa giữa {meta.from_version} →{" "}
                        {meta.to_version}. (Sau này có thể tích hợp AI Change Detection)
                    </p>
                </div>

                <div className="version-top-actions">
                    <Link to={`/hod/review/clo/${id}`} className="btn btn-ghost">
                        ← CLO
                    </Link>
                    <Link to={`/hod/review/feedback/${id}`} className="btn btn-primary">
                        Tiếp theo: Phản hồi →
                    </Link>
                </div>
            </div>

            <div className="version-meta-card">
                <div className="meta-item">
                    <div className="meta-label">Từ phiên bản</div>
                    <div className="meta-value">{meta.from_version}</div>
                </div>
                <div className="meta-item">
                    <div className="meta-label">Đến phiên bản</div>
                    <div className="meta-value">{meta.to_version}</div>
                </div>
                <div className="meta-item">
                    <div className="meta-label">Thời điểm tạo</div>
                    <div className="meta-value">
                        {new Date(meta.generated_at).toLocaleDateString()}
                    </div>
                </div>
                <div className="meta-item">
                    <div className="meta-label">Số thay đổi</div>
                    <div className="meta-value">{diffRows.length}</div>
                </div>
            </div>

            <div className="version-filter-card">
                <div className="filter-group">
                    <label>Tìm kiếm</label>
                    <input
                        placeholder="Section, nội dung before/after..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <label>Loại thay đổi</label>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="ALL">Tất cả</option>
                        <option value="added">Thêm</option>
                        <option value="changed">Sửa</option>
                        <option value="removed">Xóa</option>
                    </select>
                </div>
            </div>

            <div className="version-list-wrap">
                {filteredDiff.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-title">Không có thay đổi phù hợp.</div>
                        <div className="empty-sub">Thử đổi bộ lọc hoặc từ khóa.</div>
                    </div>
                ) : (
                    <table className="version-table">
                        <thead>
                            <tr>
                                <th>Phần</th>
                                <th>Loại</th>
                                <th>Trước</th>
                                <th>Sau</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDiff.map((r) => (
                                <tr key={r.id}>
                                    <td className="col-section">{r.section}</td>
                                    <td>
                                        <span className={typeBadgeClass(r.type)}>
                                            {typeText(r.type)}
                                        </span>
                                    </td>
                                    <td className="col-before">{r.before || "—"}</td>
                                    <td className="col-after">{r.after || "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="version-note">
                TODO (backend): có thể trả thêm “diff summary”, “highlight” và “AI detected issues”.
            </div>
        </div>
    );
}
