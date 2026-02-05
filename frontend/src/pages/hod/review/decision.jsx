import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getSyllabusDetailForHOD, submitHodReview } from "../../../services/api";
import { getCurrentUser } from "../../../services/layout";
import TabNavigation from "./TabNavigation";
import "./decision.css";

export default function Decision() {
    const navigate = useNavigate();
    const { id: idFromUrl } = useParams();
    const location = useLocation();

    console.log("Decision component mounted/updated, idFromUrl:", idFromUrl);

    const id = idFromUrl || location?.state?.id || null;

    const [loading, setLoading] = useState(true);
    const [syllabus, setSyllabus] = useState(null);
    const [error, setError] = useState(null);

    // form
    const [decision, setDecision] = useState("");
    const [reason, setReason] = useState("");
    const [confirm, setConfirm] = useState(false);

    const [checks, setChecks] = useState({
        viewedContent: false,
        checkedClo: false,
        reviewedFeedback: false,
        wroteSummary: false,
    });

    // ===== LOAD DATA =====
    useEffect(() => {
        if (!id) {
            setLoading(false);
            setSyllabus(null);
            return;
        }
        let isMounted = true;
        setLoading(true);
        setError(null);

        getSyllabusDetailForHOD(id)
            .then((detail) => {
                if (!isMounted) return;
                setSyllabus({
                    id,
                    course_name: detail.course_name,
                    faculty_name: detail.faculty_name || "",
                    lecturer: detail.lecturer_name || "",
                    submitted_date: detail.created_at || new Date(),
                    version: detail.current_version || "",
                    status: detail.status || "",
                    summary_note: "",
                });
            })
            .catch((err) => {
                if (!isMounted) return;
                console.error("Load decision detail failed", err);
                setError("Không thể tải dữ liệu quyết định.");
                setSyllabus(null);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [id]);

    const mustHaveReason = useMemo(() => {
        return decision === "require_edit" || decision === "reject";
    }, [decision]);

    const checklistOk = useMemo(() => {
        return Object.values(checks).every(Boolean);
    }, [checks]);

    const canSubmit = useMemo(() => {
        if (!id) return false;
        if (!decision) return false;
        if (mustHaveReason && reason.trim().length < 10) return false;
        if (!confirm) return false;
        if (!checklistOk) return false;
        return true;
    }, [id, decision, mustHaveReason, reason, confirm, checklistOk]);

    const toggle = (key) => setChecks((p) => ({ ...p, [key]: !p[key] }));

    const goPending = () => navigate("/hod/review/pending");

    const goDetail = () => navigate(`/hod/review/detail/${id}`);
    const goSummary = () => navigate(`/hod/review/summary/${id}`);
    const goClo = () => navigate("/hod/review/clo");
    const goFeedback = () => navigate("/hod/review/feedback");

    const handleSubmit = () => {
        if (!canSubmit) return;

        const currentUser = getCurrentUser();
        console.log("Current user:", currentUser);
        const hod_id = currentUser?.user_id || currentUser?.id;
        console.log("HOD ID:", hod_id);
        if (!hod_id) {
            alert("Không tìm thấy HOD. Vui lòng đăng nhập lại.");
            return;
        }

        const payload = {
            decision:
                decision === "approve"
                    ? "APPROVED"
                    : decision === "require_edit"
                        ? "REVISION"
                        : "REJECTED",
            feedback: reason.trim(),
        };

        submitHodReview(id, hod_id, payload.decision, payload.feedback)
            .then(() => {
                alert(
                    decision === "approve"
                        ? "✅ Đã phê duyệt và chuyển lên AA!"
                        : decision === "require_edit"
                            ? "🛠️ Đã yêu cầu chỉnh sửa và trả về giảng viên!"
                            : "⛔ Đã từ chối giáo trình!"
                );
                goPending();
            })
            .catch((err) => {
                console.error("Submit error:", err);
                console.error("Error detail:", err.response?.data);
                alert(err.response?.data?.detail || "Gửi quyết định thất bại.");
            });
    };

    // ===== RENDER =====
    if (loading) return <div className="decision-page">Đang tải...</div>;
    if (error) return <div className="decision-page">{error}</div>;

    if (!id) {
        return (
            <div className="decision-page">
                <div className="decision-header">
                    <div>
                        <h1 className="decision-title">Phê duyệt / Từ chối</h1>
                        <p className="decision-subtitle">
                            Bạn đang vào từ menu nên chưa chọn giáo trình cụ thể.
                        </p>
                    </div>
                </div>

                <div className="card">
                    <h3>Chưa có giáo trình được chọn</h3>
                    <p>
                        Hãy quay về <b>Giáo trình chờ duyệt</b> và bấm "Xem chi tiết" để vào
                        đúng giáo trình.
                    </p>
                    <button className="btn-primary" onClick={goPending}>
                        Về Pending
                    </button>
                </div>
            </div>
        );
    }

    if (!syllabus) return <div className="decision-page">Không tìm thấy giáo trình.</div>;

    return (
        <div className="decision-page">
            <TabNavigation syllabusId={id} />

            {/* HEADER */}
            <div className="decision-header">
                <div>
                    <h1 className="decision-title">Phê duyệt</h1>
                    <p className="decision-subtitle">
                        <b>{syllabus.course_name}</b> • {syllabus.version}
                    </p>
                </div>
            </div>

            <div className="grid">
                {/* LEFT: INFO + CHECKLIST */}
                <div className="card">
                    <div className="card-head">
                        <h3>Thông tin giáo trình</h3>
                    </div>

                    <div className="info">
                        <div className="row">
                            <span className="k">Môn học</span>
                            <span className="v">{syllabus.course_name}</span>
                        </div>
                        <div className="row">
                            <span className="k">Khoa</span>
                            <span className="v">{syllabus.faculty_name}</span>
                        </div>
                        <div className="row">
                            <span className="k">Giảng viên</span>
                            <span className="v">{syllabus.lecturer}</span>
                        </div>
                        <div className="row">
                            <span className="k">Ngày nộp</span>
                            <span className="v">
                                {new Date(syllabus.submitted_date).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Checklist demo */}
                    <div className="section checklist">
                        <div className="section-title">Checklist bắt buộc trước khi quyết định</div>

                        <label className="check">
                            <input
                                type="checkbox"
                                checked={checks.viewedContent}
                                onChange={() => toggle("viewedContent")}
                            />
                            Đã xem nội dung giáo trình
                        </label>

                        <label className="check">
                            <input
                                type="checkbox"
                                checked={checks.checkedClo}
                                onChange={() => toggle("checkedClo")}
                            />
                            Đã kiểm tra CLO
                        </label>

                        <label className="check">
                            <input
                                type="checkbox"
                                checked={checks.reviewedFeedback}
                                onChange={() => toggle("reviewedFeedback")}
                            />
                            Đã đọc phản hồi chuyên môn
                        </label>

                        <label className="check">
                            <input
                                type="checkbox"
                                checked={checks.wroteSummary}
                                onChange={() => toggle("wroteSummary")}
                            />
                            Đã tổng hợp góp ý
                        </label>

                        {!checklistOk && (
                            <div className="hint">
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: FORM */}
                <div className="card">
                    <h3>Quyết định của Trưởng bộ môn</h3>

                    <div className="section">
                        <div className="section-title">Chọn quyết định</div>

                        <label className="radio">
                            <input
                                type="radio"
                                name="decision"
                                value="approve"
                                checked={decision === "approve"}
                                onChange={(e) => setDecision(e.target.value)}
                            />
                            <div>
                                <div className="radio-title">Phê duyệt</div>
                                <div className="radio-desc">
                                    Chuyển lên Phòng Đào tạo (AA) duyệt cấp 2.
                                </div>
                            </div>
                        </label>

                        <label className="radio">
                            <input
                                type="radio"
                                name="decision"
                                value="require_edit"
                                checked={decision === "require_edit"}
                                onChange={(e) => setDecision(e.target.value)}
                            />
                            <div>
                                <div className="radio-title">Yêu cầu chỉnh sửa</div>
                                <div className="radio-desc">
                                    Trả về giảng viên (bắt buộc ghi lý do).
                                </div>
                            </div>
                        </label>

                        <label className="radio">
                            <input
                                type="radio"
                                name="decision"
                                value="reject"
                                checked={decision === "reject"}
                                onChange={(e) => setDecision(e.target.value)}
                            />
                            <div>
                                <div className="radio-title">Từ chối</div>
                                <div className="radio-desc">
                                    Từ chối giáo trình (bắt buộc ghi lý do).
                                </div>
                            </div>
                        </label>
                    </div>

                    <div className="section">
                        <div className="section-title">
                            Ghi chú {mustHaveReason ? <span className="req">*</span> : null}
                        </div>

                        <textarea
                            className="textarea"
                            rows={5}
                            placeholder={
                                mustHaveReason
                                    ? "Bắt buộc. Mô tả rõ lý do và yêu cầu chỉnh sửa..."
                                    : "Ghi chú thêm (nếu cần)..."
                            }
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />

                        {mustHaveReason && reason.trim().length > 0 && reason.trim().length < 10 && (
                            <div className="error">Lý do tối thiểu 10 ký tự.</div>
                        )}

                        <label className="confirm">
                            <input
                                type="checkbox"
                                checked={confirm}
                                onChange={(e) => setConfirm(e.target.checked)}
                            />
                            Tôi xác nhận quyết định này là chính xác và chịu trách nhiệm.
                        </label>
                    </div>

                    <div className="actions">
                        <button className="btn-secondary" onClick={goPending}>
                            Hủy
                        </button>

                        <button
                            className={`btn-primary ${!canSubmit ? "disabled" : ""}`}
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            title={!canSubmit ? "Chưa đủ điều kiện gửi" : ""}
                        >
                            Gửi quyết định
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
