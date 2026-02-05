import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import { getCurrentUser } from "../../../services/layout";
import TabNavigation from "../review/TabNavigation";
import "./collaborative.css";

/**
 * COLLABORATIVE REVIEW (HOD) - Phản biện cộng tác + Tổng hợp
 *
 * Gộp 2 phần:
 * 1. Feedback threads: xem và xử lý các góp ý từ giảng viên
 * 2. Summary + Decision: checklist và quyết định chuyển AA hoặc yêu cầu sửa
 *
 * ROUTE: /hod/collaborative-review/:id
 *
 * TODO BACKEND:
 * - GET  /syllabus/:id/feedback-threads
 * - GET  /syllabus/:id/review-progress
 * - POST /syllabus/:id/collaborative-submit
 */

export default function CollaborativeReview() {
    const { id } = useParams();
    const navigate = useNavigate();

    console.log("CollaborativeReview component mounted/updated, id:", id);

    // Syllabus meta
    const [syllabus, setSyllabus] = useState(null);
    const [loading, setLoading] = useState(true);

    // Feedback threads data
    const [threads, setThreads] = useState([]);

    // Reply draft for threads
    const [replyDraft, setReplyDraft] = useState({}); // { [threadId]: "text" }

    // Summary & Decision data
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState(null);
    const [summaryText, setSummaryText] = useState("");
    const [decision, setDecision] = useState(""); // forward_aa | require_edit
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Tab state: "threads" | "summary"
    const [activeTab, setActiveTab] = useState("threads");

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        let isMounted = true;
        setLoading(true);

        async function loadData() {
            setError(null);
            try {
                // Fetch chi tiết giáo trình + review comments + CLO + version diff
                const [detailRes, cloRes, diffRes] = await Promise.all([
                    api.get(`/syllabus/${id}/detail`),
                    api.get(`/syllabus/${id}/clos`),
                    api.get(`/syllabus/${id}/version-diff`),
                ]);
                if (!isMounted) return;

                const detail = detailRes.data;
                const cloList = cloRes?.data || [];
                const diff = diffRes?.data || {};

                // Set syllabus info
                setSyllabus({
                    id: detail.syllabus_id,
                    course_code: detail.course_code,
                    course_name: detail.course_name,
                    faculty_name: detail.faculty_name || "",
                    version: detail.current_version,
                    submitted_date: detail.created_at || "2026-01-05",
                });

                // Transform review_comments thành threads format
                // Chia comments thành các threads theo reviewer
                const commentMap = {};
                (detail.review_comments || []).forEach((comment, idx) => {
                    const threadId = idx + 100;
                    if (!commentMap[threadId]) {
                        commentMap[threadId] = {
                            id: threadId,
                            section: "Review",
                            title: `Phản biện #${idx + 1}`,
                            status: "open",
                            priority: "medium",
                            created_at: comment.created_at || new Date().toISOString(),
                            author: comment.reviewer_name || "GV",
                            messages: [
                                {
                                    id: comment.comment_id || Date.now(),
                                    by: comment.reviewer_name || "GV",
                                    at: comment.created_at || new Date().toISOString(),
                                    text: comment.content,
                                }
                            ],
                        };
                    }
                });

                setThreads(Object.values(commentMap));

                setProgress({
                    viewed_content: Boolean(detail.content),
                    checked_clo: cloList.length > 0,
                    viewed_version: Boolean(diff.from_version || diff.to_version),
                    handled_feedback: Object.values(commentMap).every(t => t.status === "resolved"),
                });

                setSummaryText("");
            } catch (err) {
                console.error("Load collaborative review failed:", err);
                if (!isMounted) return;
                setThreads([]);
                setProgress(null);
                setError("Không thể tải phản biện cộng tác.");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadData();
        return () => { isMounted = false; };
    }, [id]);

    const filtered = useMemo(() => {
        return [...threads].sort((a, b) => {
            const da = new Date(a.created_at).getTime();
            const db = new Date(b.created_at).getTime();
            return db - da; // latest first
        });
    }, [threads]);

    const counts = useMemo(() => {
        const open = threads.filter((t) => t.status === "open").length;
        const resolved = threads.filter((t) => t.status === "resolved").length;
        return { open, resolved, total: threads.length };
    }, [threads]);

    useEffect(() => {
        if (!progress) return;
        const handled = threads.every((t) => t.status === "resolved");
        setProgress((prev) => (prev ? { ...prev, handled_feedback: handled } : prev));
    }, [threads]);

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
        return true;
    }, [decision, reason]);

    // ===== actions =====
    const toggleResolve = (threadId) => {
        setThreads((prev) =>
            prev.map((t) => {
                if (t.id !== threadId) return t;
                const nextStatus = t.status === "open" ? "resolved" : "open";
                return {
                    ...t,
                    status: nextStatus,
                    resolved_by: nextStatus === "resolved" ? "HOD" : undefined,
                    resolved_at: nextStatus === "resolved" ? "2026-01-10" : undefined,
                };
            })
        );
    };

    const addReply = (threadId) => {
        const text = (replyDraft[threadId] || "").trim();
        if (!text) return;

        setThreads((prev) =>
            prev.map((t) => {
                if (t.id !== threadId) return t;
                const nextMsg = {
                    id: Date.now(),
                    by: "HOD",
                    at: "2026-01-10",
                    text,
                };
                return { ...t, messages: [...t.messages, nextMsg] };
            })
        );

        setReplyDraft((prev) => ({ ...prev, [threadId]: "" }));
    };

    const handleSubmitDecision = () => {
        if (!canSubmit) {
            alert("Vui lòng chọn quyết định và nhập lý do (nếu yêu cầu chỉnh sửa).");
            return;
        }

        if (!isChecklistOk) {
            const confirmText =
                "Checklist chưa hoàn tất. Bạn vẫn muốn gửi tổng hợp?";
            if (!window.confirm(confirmText)) return;
        }

        setSubmitting(true);

        // Map decision value để gửi API
        const decisionMap = {
            forward_aa: "APPROVED",
            require_edit: "REVISION",
        };

        const payload = {
            decision: decisionMap[decision] || decision,
            feedback: decision === "require_edit" ? reason : summaryText,
        };

        const hod_id = getCurrentUser()?.user_id || getCurrentUser()?.id;
        console.log("HOD ID:", hod_id, "Decision:", decision);
        if (!hod_id) {
            alert("Không tìm thấy HOD. Vui lòng đăng nhập lại.");
            setSubmitting(false);
            return;
        }

        api.post(`/syllabus/${id}/review`, payload, {
            params: { hod_id }
        })
            .then(() => {
                alert("Quyết định phản biện đã được gửi!");
                console.log("Post success, decision:", decision, "Navigating to:", decision === "forward_aa" ? `/hod/review/decision/${id}` : "/hod/review/pending");
                if (decision === "forward_aa") {
                    navigate(`/hod/review/decision/${id}`);
                } else {
                    navigate("/hod/review/pending");
                }
            })
            .catch((err) => {
                console.error("Submit decision error:", err);
                alert(
                    err.response?.data?.detail ||
                    "Gửi quyết định thất bại. Vui lòng thử lại."
                );
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    // ===== render =====
    if (loading) return <div className="collab-page">Đang tải...</div>;
    if (error) return <div className="collab-page">{error}</div>;

    if (!id) {
        return (
            <div className="collab-page">
                <div className="collab-head">
                    <h1>Phản biện cộng tác</h1>
                    <p>Vui lòng chọn giáo trình từ danh sách Pending.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="collab-page">
            <TabNavigation syllabusId={id} />

            {/* HEADER */}
            <div className="collab-head">
                <div>
                    <h1 className="collab-title">
                        Phản biện cộng tác — {syllabus?.course_name}{" "}
                        <span className="collab-version">({syllabus?.version})</span>
                    </h1>
                    <p className="collab-sub">
                        Xem và xử lý góp ý chuyên môn, sau đó tổng hợp và quyết định.
                    </p>
                </div>
            </div>

            {/* TABS */}
            <div className="collab-tabs">
                <button
                    className={`tab ${activeTab === "threads" ? "active" : ""}`}
                    onClick={() => setActiveTab("threads")}
                >
                    Theo dõi phản hồi ({counts.total})
                </button>
                <button
                    className={`tab ${activeTab === "summary" ? "active" : ""}`}
                    onClick={() => setActiveTab("summary")}
                >
                    Tổng hợp ý kiến
                </button>
            </div>

            {/* TAB CONTENT: THREADS */}
            {activeTab === "threads" && (
                <div className="collab-threads-section">
                    {/* SUMMARY STRIP */}
                    <div className="collab-strip">
                        <div className="strip-item">
                            <div className="strip-label">Chưa xử lý</div>
                            <div className="strip-value">{counts.open}</div>
                        </div>
                        <div className="strip-item">
                            <div className="strip-label">Đã xử lý</div>
                            <div className="strip-value">{counts.resolved}</div>
                        </div>
                        <div className="strip-item">
                            <div className="strip-label">Tổng</div>
                            <div className="strip-value">{counts.total}</div>
                        </div>
                    </div>

                    {/* THREADS LIST */}
                    <div className="collab-threads-list">
                        {filtered.length === 0 ? (
                            <div className="empty">
                                <div className="empty-title">Không có góp ý phù hợp.</div>
                                <div className="empty-sub">Thử đổi bộ lọc hoặc từ khóa.</div>
                            </div>
                        ) : (
                            filtered.map((t) => (
                                <div key={t.id} className="thread-card">
                                    <div className="thread-head">
                                        <div className="thread-left">
                                            <div className="thread-title">{t.title}</div>
                                            <div className="thread-meta">
                                                <span className={`pill pill-${t.status}`}>
                                                    {t.status === "open" ? "Chưa xử lý" : "Đã xử lý"}
                                                </span>
                                                <span className="thread-by">
                                                    bởi <b>{t.author}</b> •{" "}
                                                    {new Date(t.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="thread-right">
                                            <button
                                                className="btn btn-small"
                                                onClick={() => toggleResolve(t.id)}
                                            >
                                                {t.status === "open" ? "Đánh dấu đã xử lý" : "Mở lại"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* messages timeline */}
                                    <div className="thread-body">
                                        {t.messages.map((m) => (
                                            <div key={m.id} className="msg">
                                                <div className="msg-avatar">{(m.by || "?")[0]}</div>
                                                <div className="msg-content">
                                                    <div className="msg-top">
                                                        <b>{m.by}</b>
                                                        <span className="msg-time">
                                                            {new Date(m.at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="msg-text">{m.text}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* reply */}
                                    {t.status === "open" && (
                                        <div className="thread-reply">
                                            <textarea
                                                value={replyDraft[t.id] || ""}
                                                onChange={(e) => {
                                                    setReplyDraft((prev) => ({
                                                        ...prev,
                                                        [t.id]: e.target.value,
                                                    }));
                                                    // Auto-expand textarea
                                                    e.target.style.height = 'auto';
                                                    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
                                                }}
                                                rows={3}
                                                placeholder="Trả lời với vai trò HOD…"
                                            />
                                            <button className="btn btn-primary btn-sm-reply" onClick={() => addReply(t.id)}>
                                                Gửi trả lời
                                            </button>
                                        </div>
                                    )}

                                    {t.status === "resolved" && (
                                        <div className="thread-foot">
                                            Đã xử lý bởi <b>{t.resolved_by || "—"}</b> •{" "}
                                            {t.resolved_at
                                                ? new Date(t.resolved_at).toLocaleDateString()
                                                : "—"}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* TAB CONTENT: SUMMARY */}
            {activeTab === "summary" && (
                <div className="collab-summary-section">
                    {/* Checklist + Stats Grid */}
                    <div className="summary-grid">
                        {/* Checklist */}
                        <div className="card">
                            <div className="card-title">Checklist</div>

                            <div className={`check ${progress?.viewed_content ? "ok" : "no"}`}>
                                <span className="dot" />
                                <div className="check-body">
                                    <div className="check-title">Đã xem nội dung giáo trình</div>
                                    <div className="check-sub"></div>
                                </div>
                            </div>

                            <div className={`check ${progress?.checked_clo ? "ok" : "no"}`}>
                                <span className="dot" />
                                <div className="check-body">
                                    <div className="check-title">Đã kiểm tra CLO</div>
                                    <div className="check-sub"></div>
                                </div>
                            </div>

                            <div className={`check ${progress?.viewed_version ? "ok" : "no"}`}>
                                <span className="dot" />
                                <div className="check-body">
                                    <div className="check-title">Đã xem thay đổi phiên bản</div>
                                    <div className="check-sub"></div>
                                </div>
                            </div>

                            <div className={`check ${progress?.handled_feedback ? "ok" : "no"}`}>
                                <span className="dot" />
                                <div className="check-body">
                                    <div className="check-title">Đã xử lý phản biện chuyên môn</div>
                                    <div className="check-sub"></div>
                                </div>
                            </div>

                            {!isChecklistOk && (
                                <div className="warn">
                                    Checklist chưa hoàn tất. Bạn vẫn có thể gửi nhưng nên hoàn tất để đảm bảo chất lượng.
                                </div>
                            )}
                        </div>

                        {/* Summary Form */}
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
                                        <b>Tiếp tục sang phê duyệt</b>
                                        <div className="hint">
                                            Giáo trình đạt yêu cầu sau phản biện, tiếp tục đánh giá cuối.
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
                                            Bắt buộc nhập lý do để minh bạch.
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
                                    Quay lại
                                </button>
                                <button className="btn btn-primary" onClick={handleSubmitDecision}>
                                    {decision === "forward_aa" ? "Tiếp tục Decision →" : "Gửi tổng hợp"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
