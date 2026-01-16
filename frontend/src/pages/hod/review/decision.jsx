import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TabNavigation from "./TabNavigation";
import "./decision.css";

export default function Decision() {
    const navigate = useNavigate();
    const { id: idFromUrl } = useParams();
    const location = useLocation();

    const id = idFromUrl || location?.state?.id || null;

    const [loading, setLoading] = useState(true);
    const [syllabus, setSyllabus] = useState(null);

    // form
    const [decision, setDecision] = useState("");
    const [reason, setReason] = useState("");
    const [confirm, setConfirm] = useState(false);

    const [checks, setChecks] = useState({
        viewedContent: false,
        checkedClo: false,
        viewedVersion: false,
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

        const mock = {
            id,
            course_name: "Toán Cao Cấp",
            faculty_name: "Khoa Toán",
            lecturer: "Nguyễn Văn A",
            submitted_date: "2026-01-02",
            version: "2025-2026 • v2",
            status: "pending",
            summary_note:
                "Đa số góp ý: CLO cần rõ ràng hơn, rubric nên thống nhất. Nội dung tổng quan phù hợp.",
        };

        setSyllabus(mock);
        setLoading(false);
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

    const goEvaluate = () => navigate(`/hod/review/evaluate/${id}`);
    const goSummary = () => navigate(`/hod/review/summary/${id}`);
    const goClo = () => navigate("/hod/review/clo");
    const goVersion = () => navigate("/hod/review/version");
    const goFeedback = () => navigate("/hod/review/feedback");

    const handleSubmit = () => {
        if (!canSubmit) return;

        const payload = {
            id,
            decision,
            reason: reason.trim(),
            checks,
        };

        console.log("DECISION SUBMIT:", payload);

        alert(
            decision === "approve"
                ? "✅ Đã phê duyệt và chuyển lên AA!"
                : decision === "require_edit"
                    ? "🛠️ Đã yêu cầu chỉnh sửa và trả về giảng viên!"
                    : "⛔ Đã từ chối đề cương!"
        );

        goPending();
    };

    // ===== RENDER =====
    if (loading) return <div className="decision-page">Đang tải...</div>;

    if (!id) {
        return (
            <div className="decision-page">
                <div className="decision-header">
                    <div>
                        <h1 className="decision-title">Phê duyệt / Từ chối</h1>
                        <p className="decision-subtitle">
                            Bạn đang vào từ menu nên chưa chọn đề cương cụ thể.
                        </p>
                    </div>
                </div>

                <div className="card">
                    <h3>Chưa có đề cương được chọn</h3>
                    <p>
                        Hãy quay về <b>Đề cương chờ duyệt</b> và bấm “Xem chi tiết” để vào
                        đúng đề cương.
                    </p>
                    <button className="btn-primary" onClick={goPending}>
                        Về Pending
                    </button>
                </div>
            </div>
        );
    }

    if (!syllabus) return <div className="decision-page">Không tìm thấy đề cương.</div>;

    return (
        <div className="decision-page">
            <TabNavigation syllabusId={id} />

            {/* HEADER */}
            <div className="decision-header">
                <div>
                    <h1 className="decision-title">Phê duyệt / Từ chối</h1>
                    <p className="decision-subtitle">
                        <b>{syllabus.course_name}</b> • {syllabus.faculty_name} •{" "}
                        {syllabus.version}
                    </p>
                </div>
            </div>

            <div className="grid">
                {/* LEFT: INFO + CHECKLIST */}
                <div className="card">
                    <div className="card-head">
                        <h3>Thông tin đề cương</h3>
                        <span className={`badge badge-${syllabus.status}`}>{syllabus.status}</span>
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

                    {/* Quick links */}
                    <div className="section">
                        <div className="section-title">Bước kiểm tra nhanh</div>
                        <div className="chips">
                            <button className="chip" onClick={goEvaluate}>Xem nội dung</button>
                            <button className="chip" onClick={goClo}>Kiểm tra CLO</button>
                            <button className="chip" onClick={goVersion}>Xem thay đổi</button>
                            <button className="chip" onClick={goFeedback}>Phản hồi chuyên môn</button>
                            <button className="chip" onClick={goSummary}>Tổng hợp góp ý</button>
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
                            Đã xem nội dung đề cương
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
                                checked={checks.viewedVersion}
                                onChange={() => toggle("viewedVersion")}
                            />
                            Đã xem thay đổi phiên bản
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
                            Đã tổng hợp góp ý (Summary)
                        </label>

                        {!checklistOk && (
                            <div className="hint">
                                * Demo quy trình: phải tick đủ checklist trước khi gửi quyết định.
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: FORM */}
                <div className="card">
                    <h3>Quyết định của Trưởng bộ môn</h3>

                    {/* summary preview */}
                    <div className="section">
                        <div className="section-title">Tóm tắt hiện có</div>
                        <div className="summary-box">
                            {syllabus.summary_note || "Chưa có tổng hợp."}
                        </div>
                    </div>

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
                                <div className="radio-title">Phê duyệt (Approve)</div>
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
                                    Từ chối đề cương (bắt buộc ghi lý do).
                                </div>
                            </div>
                        </label>
                    </div>

                    <div className="section">
                        <div className="section-title">
                            Lý do / ghi chú {mustHaveReason ? <span className="req">*</span> : null}
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
                            Hủy / Quay lại
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

                    <div className="devnote">
                        <b>Dev note:</b> Sau này thay mock bằng API:
                        <ul>
                            <li>GET <code>/syllabus/{`{id}`}</code></li>
                            <li>POST <code>/syllabus/{`{id}`}/decision</code> (decision, reason)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
