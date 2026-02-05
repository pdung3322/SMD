import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import TabNavigation from "./TabNavigation";
import "./clo.css";


export default function Clo() {
    const { id } = useParams();

    console.log("Clo component mounted/updated, id:", id);

    const [syllabus, setSyllabus] = useState(null);
    const [clos, setClos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            setLoading(true);
            setError(null);

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
                    }))
                );
            } catch (err) {
                console.error("Load CLO failed", err);

                if (!isMounted) return;
                setError("Không thể tải CLO. Vui lòng thử lại.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadData();
        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) return <div className="clo-page">Đang tải...</div>;
    if (error) return <div className="clo-page">{error}</div>;
    if (!syllabus) return <div className="clo-page">Không tìm thấy giáo trình.</div>;

    return (
        <div className="clo-page">
            <TabNavigation syllabusId={id} />

            {/* ===== HEADER ===== */}
            <div className="clo-header">
                <div>
                    <h1 className="clo-title">
                        Kiểm tra CLO — {syllabus.course_name}
                    </h1>
                </div>
            </div>

            {/* ===== INFO CARD ===== */}
            <div className="clo-info-card">
                <div className="info-item">
                    <div className="info-label">Mã giáo trình</div>
                    <div className="info-value">{syllabus.course_code}</div>
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
                    </div>
                ) : (
                    <div className="clo-items">
                        {clos.map((c) => (
                            <div key={c.clo_code} className="clo-item">
                                {c.description}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
