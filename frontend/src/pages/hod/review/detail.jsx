import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../../services/api";
import TabNavigation from "./TabNavigation";
import "./detail.css";

export default function Detail() {
    const { id } = useParams();  // ← Lấy syllabus_id từ URL
    const navigate = useNavigate();
    const location = useLocation();

    console.log("Detail component mounted/updated, id:", id);

    const [syllabus, setSyllabus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [decision, setDecision] = useState("");

    // Không cần activeTab state nữa vì dùng routing

    const pdfUrl = syllabus?.pdf_url || (
        typeof syllabus?.content === "string" &&
            syllabus.content.trim().toLowerCase().endsWith(".pdf")
            ? syllabus.content.trim()
            : null
    );

    const handleOpenPdf = () => {
        if (pdfUrl) {
            window.open(pdfUrl, "_blank", "noopener,noreferrer");
        }
    };

    /* ===== LOAD CHI TIẾT GIÁO TRÌNH ===== */
    useEffect(() => {
        console.log("Loading evaluate for id:", id);
        api.get(`/syllabus/${id}/detail`)
            .then((res) => {
                console.log("Evaluate data loaded:", res.data);
                setSyllabus(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading syllabus detail:", err);
                setLoading(false);
            });
    }, [id]);

    /* ===== SUBMIT QUYẾT ĐỊNH HOD ===== */
    const handleSubmit = () => {
        if (!decision) {
            alert("Vui lòng chọn quyết định.");
            return;
        }

        setSubmitting(true);

        const hod_id = 1;  // TODO: lấy từ user đang login

        api.post(`/syllabus/${id}/review`,
            {
                decision: decision,
                feedback: feedback || null
            },
            {
                params: { hod_id }
            }
        )
            .then((res) => {
                alert("Quyết định duyệt đã được gửi!");
                navigate("/hod/review/pending");
            })
            .catch((err) => {
                alert(
                    err.response?.data?.detail ||
                    "Gửi quyết định thất bại. Vui lòng thử lại."
                );
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    if (loading) return <div className="detail-page">Đang tải...</div>;
    if (!syllabus) return <div className="detail-page">Không tìm thấy giáo trình.</div>;

    return (
        <div className="detail-page">
            <TabNavigation syllabusId={id} />

            <h1 className="detail-title">Đánh giá: {syllabus.course_name}</h1>

            {/* ===== NỘI DUNG GIÁO TRÌNH ===== */}
            <div className="detail-card">
                <h3>Thông tin giáo trình</h3>
                <p>
                    <strong>Mã giáo trình:</strong> {syllabus.course_code}
                </p>
                <p>
                    <strong>Tên giáo trình:</strong> {syllabus.course_name}
                </p>
                <p>
                    <strong>Tín chỉ:</strong> {syllabus.credits}
                </p>
                <p>
                    <strong>Giảng viên:</strong> {syllabus.lecturer_name}
                </p>
                <p>
                    <strong>Phiên bản hiện tại:</strong> {syllabus.current_version}
                </p>
            </div>

            <div className="detail-card">
                <h3>Nội dung chi tiết</h3>
                <div className="pdf-toolbar">
                    {pdfUrl ? (
                        <button className="btn-primary" onClick={handleOpenPdf}>
                            Mở file PDF
                        </button>
                    ) : (
                        <span className="pdf-note">
                            Không thấy link PDF. Đang hiển thị nội dung HTML.
                        </span>
                    )}
                </div>
                <div className="syllabus-content">
                    {pdfUrl ? (
                        <p className="pdf-note">
                            Nội dung được gửi dạng PDF. Nhấn "Mở file PDF" để xem trong tab mới.
                        </p>
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: syllabus.content }} />
                    )}
                </div>
            </div>
        </div>
    );
}