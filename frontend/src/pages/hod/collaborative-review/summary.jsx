import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./summary.css";

/**
 * SUMMARY (HOD) - Tổng hợp ý kiến & chuyển trạng thái
 *
 * UI logic (giống workflow systems):
 * - Checklist bắt buộc trước khi submit (giảm "duyệt bừa")
 * - Tổng hợp góp ý + quyết định Forward AA hoặc Require Edit
 * - Lý do bắt buộc khi Require Edit (đúng đề tài)
 *
 * ROUTE:
 * - /hod/review/summary         (không id -> chọn đề cương)
 * - /hod/review/summary/:id     (có id -> tổng hợp của đề cương)
 *
 * TODO BACKEND:
 * - GET  /syllabus/:id/review-progress  (các cờ checklist)
 * - GET  /syllabus/:id/summary-context  (thông tin + thống kê feedback)
 * - POST /syllabus/:id/summary-submit   (submit quyết định + comment)
 */

export default function Summary() {
    const { id } = useParams(); // optional
    const navigate = useNavigate();

    const [pickList, setPickList] = useState([]);

    const [syllabus, setSyllabus] = useState(null);
    const [stats, setStats] = useState(null); // feedback stats etc.
    const [progress, setProgress] = useState(null); // checklist flags

    const [loading, setLoading] = useState(true);

    // form
    const [summaryText, setSummaryText] = useState("");
    const [decision, setDecision] = useState(""); // forward_aa | require_edit
    const [reason, setReason] = useState(""); // bắt buộc nếu require_edit

    useEffect(() => {
        setLoading(true);

        // mock pick list
        const mockPick = [
            { id: 1, course_name: "Toán Cao Cấp", faculty_name: "Khoa Toán" },
            { id: 2, course_name: "Lập Trình Web", faculty_name: "Khoa CNTT" },
        ];
        setPickList(mockPick);

        if (!id) {
            setSyllabus(null);
            setStats(null);
            setProgress(null);
            setLoading(false);
            return;
        }

        // ===== MOCK CONTEXT =====
        // TODO backend: axios.get(`/syllabus/${id}/summary-context`)
        const mockSyllabus = {
            id,
            course_code: "WEB201",
            course_name: id === "2" ? "Lập Trình Web" : "Toán Cao Cấp",
            faculty_name: id === "2" ? "Khoa CNTT" : "Khoa Toán",
            version: "v1",
            submitted_date: "2026-01-05",
        };

        // TODO backend: axios.get(`/syllabus/${id}/review-progress`)
        const mockProgress = {
            viewed_content: true,
            checked_clo: true,
            viewed_version: true,
            handled_feedback: false, // ví dụ còn feedback open
        };

        const mockStats = {
            feedback_open: 2,
            feedback_resolved: 1,
            key_risks: [
                "CLO2 mô tả rộng, cần cụ thể hóa",
                "Thiếu nội dung HTTP status + ví dụ",
            ],
        };

        setSyllabus(mockSyllabus);
        setProgress(mockProgress);
        setStats(mockStats);

        // gợi ý auto text
        setSummaryText(
            `Tổng hợp: \n- Các góp ý chính: ${mockStats.key_risks.join(
                "; "
            )}\n- Đề xuất xử lý: (điền khi backend xong)\n`
        );

        setLoading(false);
    }, [id]);

    const isChecklistOk = useMemo(() => {
        if (!progress) return false;
        return (
            progress.viewed_content &&
            progress.checked_clo &&
            progress.viewed_version &&
            progress.handled_feedback
        );
    }, [progress]);

    const canSubmit = useMemo(() => {
        if (!decision) return false;
        if (decision === "require_edit" && !reason.trim()) return false;
        // checklist: bạn có thể chọn strict (bắt buộc) hoặc soft (cảnh báo)
        // ở đây mình set "soft block": nếu chưa OK thì vẫn cho submit nhưng warning (tùy bạn)
        return true;
    }, [decision, reason]);

    const handleSubmit = () => {
        if (!canSubmit) {
            alert("Vui lòng chọn quyết định và nhập lý do (nếu yêu cầu chỉnh sửa).");
            return;
        }

        if (!isChecklistOk) {
            const confirmText =
                "Checklist chưa hoàn tất (còn bước chưa xem/xử lý). Bạn vẫn muốn gửi tổng hợp?";
            // để đơn giản demo: dùng confirm
            if (!window.confirm(confirmText)) return;
        }

        // TODO backend: axios.post(`/syllabus/${id}/summary-submit`, payload)
        const payload = {
            syllabus_id: id,
            decision,
            summaryText,
            reason: decision === "require_edit" ? reason : null,
        };
        console.log("SUBMIT SUMMARY:", payload);

        alert("Đã gửi tổng hợp (mock)!");
        navigate("/hod/review/pending");
    };

    if (loading) return <div className="sum-page">Đang tải...</div>;

    // ===== no id -> pick =====
    if (!id) {
        return (
            <div className="sum-page">
                <div className="sum-head">
                    <div>
                        <h1 className="sum-title">Tổng hợp ý kiến</h1>
                        <p className="sum-sub">
                            Chọn đề cương để tổng hợp góp ý và đưa ra quyết định cấp HoD.
                        </p>
                    </div>
                </div>

                <div className="sum-pick-card">
                    <div className="pick-label">Chọn đề cương</div>
                    <div className="pick-grid">
                        {pickList.map((s) => (
                            <button
                                key={s.id}
                                className="pick-item"
                                onClick={() => navigate(`/hod/review/summary/${s.id}`)}
                            >
                                <div className="pick-name">{s.course_name}</div>
                                <div className="pick-meta">{s.faculty_name}</div>
                            </button>
                        ))}
                    </div>
                    <div className="sum-note">
                        TODO (backend): list này lấy theo trạng thái “collaborative ended / pending HOD”.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sum-page">
            {/* header */}
            <div className="sum-head">
                <div>
                    <h1 className="sum-title">
                        Tổng hợp — {syllabus?.course_name}{" "}
                        <span className="sum-version">({syllabus?.version})</span>
                    </h1>
                    <p className="sum-sub">
                        Trang “chốt” trước khi HoD gửi lên AA hoặc trả về giảng viên kèm lý do.
                    </p>
                </div>

                <div className="sum-actions">
                    <Link to={`/hod/review/feedback/${id}`} className="btn btn-ghost">
                        ← Feedback
                    </Link>
                    <Link to={`/hod/review/evaluate/${id}`} className="btn btn-ghost">
                        Nội dung →
                    </Link>
                </div>
            </div>

            {/* top grid: checklist + insight */}
            <div className="sum-grid">
                {/* checklist */}
                <div className="card">
                    <div className="card-title">Checklist trước khi chốt</div>

                    <div className={`check ${progress.viewed_content ? "ok" : "no"}`}>
                        <span className="dot" />
                        <div className="check-body">
                            <div className="check-title">Đã xem nội dung đề cương</div>
                            <div className="check-sub">
                                Gợi ý: xem /hod/review/evaluate/:id
                            </div>
                        </div>
                        <Link className="mini-link" to={`/hod/review/evaluate/${id}`}>
                            Mở
                        </Link>
                    </div>

                    <div className={`check ${progress.checked_clo ? "ok" : "no"}`}>
                        <span className="dot" />
                        <div className="check-body">
                            <div className="check-title">Đã kiểm tra CLO</div>
                            <div className="check-sub">Đảm bảo CLO rõ ràng, đủ và hợp lý.</div>
                        </div>
                        <Link className="mini-link" to={`/hod/review/clo/${id}`}>
                            Mở
                        </Link>
                    </div>

                    <div className={`check ${progress.viewed_version ? "ok" : "no"}`}>
                        <span className="dot" />
                        <div className="check-body">
                            <div className="check-title">Đã xem thay đổi phiên bản</div>
                            <div className="check-sub">Nắm các thay đổi quan trọng.</div>
                        </div>
                        <Link className="mini-link" to={`/hod/review/version/${id}`}>
                            Mở
                        </Link>
                    </div>

                    <div className={`check ${progress.handled_feedback ? "ok" : "no"}`}>
                        <span className="dot" />
                        <div className="check-body">
                            <div className="check-title">Đã xử lý phản biện chuyên môn</div>
                            <div className="check-sub">
                                Ưu tiên đóng góp ý “High” trước khi gửi AA.
                            </div>
                        </div>
                        <Link className="mini-link" to={`/hod/review/feedback/${id}`}>
                            Mở
                        </Link>
                    </div>

                    {!isChecklistOk && (
                        <div className="warn">
                            Checklist chưa hoàn tất. Bạn vẫn có thể submit (mock), nhưng thực tế
                            nên hoàn tất để tránh bị “bắt bẻ”.
                        </div>
                    )}
                </div>

                {/* insights */}
                <div className="card">
                    <div className="card-title">Tổng quan góp ý</div>

                    <div className="stat-row">
                        <div className="stat">
                            <div className="stat-label">Feedback OPEN</div>
                            <div className="stat-value">{stats?.feedback_open ?? 0}</div>
                        </div>
                        <div className="stat">
                            <div className="stat-label">Feedback RESOLVED</div>
                            <div className="stat-value">{stats?.feedback_resolved ?? 0}</div>
                        </div>
                    </div>

                    <div className="risk-title">Vấn đề nổi bật</div>
                    <ul className="risk-list">
                        {(stats?.key_risks || []).map((r, idx) => (
                            <li key={idx}>{r}</li>
                        ))}
                    </ul>

                    <div className="sum-note">
                        TODO (backend): thống kê này có thể lấy từ thread + AI summary.
                    </div>
                </div>
            </div>

            {/* form */}
            <div className="card">
                <div className="card-title">Tổng hợp của HoD</div>

                <label className="field">
                    <span>Nội dung tổng hợp</span>
                    <textarea
                        rows={6}
                        value={summaryText}
                        onChange={(e) => setSummaryText(e.target.value)}
                        placeholder="Tóm tắt góp ý chính, hướng xử lý, kết luận..."
                    />
                </label>

                <div className="decision-box">
                    <div className="decision-title">Quyết định</div>

                    <label className="radio">
                        <input
                            type="radio"
                            name="decision"
                            value="forward_aa"
                            onChange={(e) => setDecision(e.target.value)}
                        />
                        <div>
                            <b>Chuyển lên Phòng Đào tạo (AA)</b>
                            <div className="hint">
                                Đề cương đạt yêu cầu cấp HoD và sẵn sàng duyệt cấp 2.
                            </div>
                        </div>
                    </label>

                    <label className="radio">
                        <input
                            type="radio"
                            name="decision"
                            value="require_edit"
                            onChange={(e) => setDecision(e.target.value)}
                        />
                        <div>
                            <b>Yêu cầu chỉnh sửa (trả về giảng viên)</b>
                            <div className="hint">
                                Bắt buộc nhập lý do để minh bạch và theo workflow.
                            </div>
                        </div>
                    </label>

                    {decision === "require_edit" && (
                        <label className="field">
                            <span>Lý do bắt buộc</span>
                            <textarea
                                rows={3}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Nêu rõ lỗi/thiếu, yêu cầu sửa cụ thể..."
                            />
                        </label>
                    )}
                </div>

                <div className="form-actions">
                    <button className="btn" onClick={() => navigate("/hod/review/pending")}>
                        Quay lại Pending
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        Gửi tổng hợp
                    </button>
                </div>
            </div>
        </div>
    );
}
