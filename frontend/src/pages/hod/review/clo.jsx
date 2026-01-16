import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import TabNavigation from "./TabNavigation";
import "./clo.css";


export default function Clo() {
    const { id } = useParams();

    const [syllabus, setSyllabus] = useState(null);
    const [clos, setClos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usedFallback, setUsedFallback] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            setLoading(true);
            setError(null);
            setUsedFallback(false);

            try {
                const [detailRes, cloRes] = await Promise.all([
                    api.get(`/syllabus/${id}/detail`),
                    api.get(`/syllabus/${id}/clos`),
                ]);

                if (!isMounted) return;

                const detail = detailRes?.data;
                const cloList = cloRes?.data || [];

                setSyllabus({
                    id,
                    course_code: detail.course_code,
                    course_name: detail.course_name,
                    faculty_name: detail.faculty_name || "",
                    version: detail.current_version,
                    submitted_date: detail.submitted_date || detail.created_at || new Date(),
                });

                setClos(
                    cloList.map((c, idx) => ({
                        clo_code: c.code || c.clo_code || `CLO${idx + 1}`,
                        description: c.description || "",
                        level: c.level || c.bloom_level || "K1",
                        status: c.status || "ok",
                        note: c.note || "",
                    }))
                );
            } catch (err) {
                console.error("Load CLO failed", err);

                if (!isMounted) return;

                // Fallback mock để vẫn hiển thị UI
                setUsedFallback(true);
                setSyllabus({
                    id,
                    course_code: "WEB201",
                    course_name: "Lập Trình Web",
                    faculty_name: "Khoa CNTT",
                    version: "v1",
                    submitted_date: "2026-01-02",
                });

                setClos([
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
                ]);

                setError(null); // giữ UI chạy với dữ liệu fallback
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadData();
        return () => {
            isMounted = false;
        };
    }, [id]);

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
            <TabNavigation syllabusId={id} />

            {/* ===== HEADER ===== */}
            <div className="clo-header">
                <div>
                    <h1 className="clo-title">
                        Kiểm tra CLO — {syllabus.course_name}
                    </h1>
                    {usedFallback && (
                        <p className="clo-warning">Đang hiển thị dữ liệu mẫu do chưa lấy được từ máy chủ.</p>
                    )}
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

            {/* ===== LIST ===== */}
            <div className="clo-list-wrap">
                {clos.length === 0 ? (
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
                            {clos.map((c) => (
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
        </div>
    );
}
