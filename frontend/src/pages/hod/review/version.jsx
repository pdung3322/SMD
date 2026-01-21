import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import TabNavigation from "./TabNavigation";
import "./version.css";

export default function Version() {
    const { id } = useParams();

    const [meta, setMeta] = useState(null);
    const [diffRows, setDiffRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usedFallback, setUsedFallback] = useState(false);

    // filter
    const [typeFilter, setTypeFilter] = useState("ALL");

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            setLoading(true);
            setError(null);
            setUsedFallback(false);

            try {
                const res = await api.get(`/syllabus/${id}/version-diff`);
                if (!isMounted) return;

                const data = res?.data || {};
                setMeta({
                    course_name: data.course_name || "—",
                    from_version: data.from_version || "N/A",
                    to_version: data.to_version || "N/A",
                    generated_at: data.generated_at || new Date().toISOString(),
                });

                const items = Array.isArray(data.items) ? data.items : [];
                setDiffRows(
                    items.map((item, idx) => ({
                        id: item.id || idx + 1,
                        section: item.section || "(không rõ mục)",
                        type: item.type || "changed",
                        before: item.before || "",
                        after: item.after || "",
                    }))
                );
            } catch (err) {
                console.error("Load version diff failed", err);

                if (!isMounted) return;

                // Fallback mock để vẫn hiển thị UI
                setUsedFallback(true);
                setMeta({
                    syllabus_id: id,
                    course_name: "Lập Trình Web",
                    from_version: "v0",
                    to_version: "v1",
                    generated_at: "2026-01-05",
                });

                setDiffRows([
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
                ]);

                setError(null); // vẫn hiển thị UI với dữ liệu fallback
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadData();
        return () => {
            isMounted = false;
        };
    }, [id]);

    const filteredDiff = useMemo(() => {
        return diffRows.filter((r) => {
            const matchType = typeFilter === "ALL" || r.type === typeFilter;
            return matchType;
        });
    }, [diffRows, typeFilter]);

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
            <TabNavigation syllabusId={id} />

            <div className="version-header">
                <div>
                    <h1 className="version-title">
                        Thay đổi phiên bản — {meta.course_name}
                    </h1>
                    {usedFallback && (
                        <p className="version-warning">Đang hiển thị dữ liệu mẫu do chưa lấy được từ máy chủ.</p>
                    )}
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
                        <div className="empty-sub">Thử đổi bộ lọc hoặc đây có thể là đề cương chưa có đủ phiên bản để so sánh.</div>
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
        </div>
    );
}
