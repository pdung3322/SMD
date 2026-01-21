import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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

    // Syllabus meta
    const [syllabus, setSyllabus] = useState(null);
    const [loading, setLoading] = useState(true);

    // Feedback threads data
    const [threads, setThreads] = useState([]);

    // Filters for threads
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("ALL"); // ALL | open | resolved
    const [section, setSection] = useState("ALL"); // ALL | CLO | Assessment | Content | Materials
    const [sort, setSort] = useState("latest"); // latest | oldest

    // Reply draft for threads
    const [replyDraft, setReplyDraft] = useState({}); // { [threadId]: "text" }

    // Summary & Decision data
    const [progress, setProgress] = useState(null);
    const [stats, setStats] = useState(null);
    const [summaryText, setSummaryText] = useState("");
    const [decision, setDecision] = useState(""); // forward_aa | require_edit
    const [reason, setReason] = useState("");

    // Tab state: "threads" | "summary"
    const [activeTab, setActiveTab] = useState("threads");

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        setLoading(true);

        // ===== MOCK SYLLABUS =====
        const mockSyllabus = {
            id,
            course_code: "WEB201",
            course_name: id === "2" ? "Lập Trình Web" : "Toán Cao Cấp",
            faculty_name: id === "2" ? "Khoa CNTT" : "Khoa Toán",
            version: "v1",
            submitted_date: "2026-01-05",
        };

        // ===== MOCK THREADS =====
        const mockThreads = [
            {
                id: 101,
                section: "CLO",
                title: "CLO2 mô tả còn rộng",
                status: "open",
                priority: "medium",
                created_at: "2026-01-06",
                author: "GV A",
                messages: [
                    {
                        id: 1,
                        by: "GV A",
                        at: "2026-01-06",
                        text: "CLO2 mô tả hơi rộng, nên cụ thể hóa tiêu chí đánh giá.",
                    },
                    {
                        id: 2,
                        by: "GV B",
                        at: "2026-01-07",
                        text: "Đồng ý. Có thể thêm động từ Bloom rõ hơn (trình bày/thiết kế/triển khai…).",
                    },
                ],
            },
            {
                id: 102,
                section: "Assessment",
                title: "Tỉ lệ giữa kỳ/cuối kỳ",
                status: "resolved",
                priority: "low",
                created_at: "2026-01-05",
                author: "GV C",
                messages: [
                    {
                        id: 1,
                        by: "GV C",
                        at: "2026-01-05",
                        text: "Tỉ lệ 30/70 hợp lý, nhưng nên ghi rõ rubric.",
                    },
                    {
                        id: 2,
                        by: "HOD",
                        at: "2026-01-06",
                        text: "Đã ghi chú bổ sung rubric trong bản cập nhật.",
                    },
                ],
                resolved_by: "HOD",
                resolved_at: "2026-01-06",
            },
            {
                id: 103,
                section: "Content",
                title: "Thiếu nội dung phần HTTP Status",
                status: "open",
                priority: "high",
                created_at: "2026-01-07",
                author: "GV B",
                messages: [
                    {
                        id: 1,
                        by: "GV B",
                        at: "2026-01-07",
                        text: "Nên bổ sung HTTP status codes + ví dụ thực tế.",
                    },
                ],
            },
        ];

        // ===== MOCK PROGRESS & STATS =====
        const mockProgress = {
            viewed_content: true,
            checked_clo: true,
            viewed_version: true,
            handled_feedback: false,
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
        setThreads(mockThreads);
        setProgress(mockProgress);
        setStats(mockStats);

        // Auto-fill summary text
        setSummaryText(
            `Tổng hợp: \n- Các góp ý chính: ${mockStats.key_risks.join(
                "; "
            )}\n- Đề xuất xử lý: (điền khi backend xong)\n`
        );

        setLoading(false);
    }, [id]);

    const filtered = useMemo(() => {
        let data = [...threads];

        if (status !== "ALL") data = data.filter((t) => t.status === status);
        if (section !== "ALL") data = data.filter((t) => t.section === section);

        const kw = q.trim().toLowerCase();
        if (kw) {
            data = data.filter((t) => {
                const inTitle = (t.title || "").toLowerCase().includes(kw);
                const inMsg = (t.messages || []).some((m) =>
                    (m.text || "").toLowerCase().includes(kw)
                );
                return inTitle || inMsg;
            });
        }

        data.sort((a, b) => {
            const da = new Date(a.created_at).getTime();
            const db = new Date(b.created_at).getTime();
            return sort === "latest" ? db - da : da - db;
        });

        return data;
    }, [threads, status, section, q, sort]);

    const counts = useMemo(() => {
        const open = threads.filter((t) => t.status === "open").length;
        const resolved = threads.filter((t) => t.status === "resolved").length;
        return { open, resolved, total: threads.length };
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

        const payload = {
            syllabus_id: id,
            decision,
            summaryText,
            reason: decision === "require_edit" ? reason : null,
        };
        console.log("SUBMIT COLLABORATIVE DECISION:", payload);

        if (decision === "forward_aa") {
            // Chuyển sang Decision page
            navigate(`/hod/review/decision/${id}`);
        } else {
            alert("Đã gửi tổng hợp yêu cầu chỉnh sửa (mock)!");
            navigate("/hod/review/pending");
        }
    };

    // ===== render =====
    if (loading) return <div className="collab-page">Đang tải...</div>;

    if (!id) {
        return (
            <div className="collab-page">
                <div className="collab-head">
                    <h1>Phản biện cộng tác</h1>
                    <p>Vui lòng chọn đề cương từ danh sách Pending.</p>
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
                            <div className="strip-label">Open</div>
                            <div className="strip-value">{counts.open}</div>
                        </div>
                        <div className="strip-item">
                            <div className="strip-label">Resolved</div>
                            <div className="strip-value">{counts.resolved}</div>
                        </div>
                        <div className="strip-item">
                            <div className="strip-label">Total</div>
                            <div className="strip-value">{counts.total}</div>
                        </div>
                        <div className="strip-item">
                            <div className="strip-label">Ngày nộp</div>
                            <div className="strip-value">
                                {new Date(syllabus.submitted_date).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* FILTER BAR */}
                    <div className="collab-filter">
                        <div className="fg">
                            <label>Tìm kiếm</label>
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Tìm theo tiêu đề hoặc nội dung góp ý..."
                            />
                        </div>
                        <div className="fg">
                            <label>Trạng thái</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="ALL">Tất cả</option>
                                <option value="open">Đang mở</option>
                                <option value="resolved">Đã xử lý</option>
                            </select>
                        </div>
                        <div className="fg">
                            <label>Nhóm mục</label>
                            <select value={section} onChange={(e) => setSection(e.target.value)}>
                                <option value="ALL">Tất cả</option>
                                <option value="CLO">CLO</option>
                                <option value="Assessment">Đánh giá</option>
                                <option value="Content">Nội dung</option>
                                <option value="Materials">Tài liệu</option>
                            </select>
                        </div>
                        <div className="fg">
                            <label>Sắp xếp</label>
                            <select value={sort} onChange={(e) => setSort(e.target.value)}>
                                <option value="latest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                            </select>
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
                                                    {t.status === "open" ? "OPEN" : "RESOLVED"}
                                                </span>
                                                <span className={`pill pill-pr-${t.priority}`}>
                                                    {t.priority.toUpperCase()}
                                                </span>
                                                <span className="pill pill-sec">{t.section}</span>
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
                                    <div className="thread-reply">
                                        <textarea
                                            value={replyDraft[t.id] || ""}
                                            onChange={(e) =>
                                                setReplyDraft((prev) => ({
                                                    ...prev,
                                                    [t.id]: e.target.value,
                                                }))
                                            }
                                            rows={2}
                                            placeholder="Trả lời với vai trò HOD (mock)…"
                                        />
                                        <button className="btn btn-primary" onClick={() => addReply(t.id)}>
                                            Gửi trả lời
                                        </button>
                                    </div>

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
                            <div className="card-title">Checklist trước khi chốt</div>

                            <div className={`check ${progress?.viewed_content ? "ok" : "no"}`}>
                                <span className="dot" />
                                <div className="check-body">
                                    <div className="check-title">Đã xem nội dung đề cương</div>
                                    <div className="check-sub">Gợi ý: xem evaluate page</div>
                                </div>
                                <Link className="mini-link" to={`/hod/review/evaluate/${id}`}>
                                    Mở
                                </Link>
                            </div>

                            <div className={`check ${progress?.checked_clo ? "ok" : "no"}`}>
                                <span className="dot" />
                                <div className="check-body">
                                    <div className="check-title">Đã kiểm tra CLO</div>
                                    <div className="check-sub">Đảm bảo CLO rõ ràng, đủ và hợp lý.</div>
                                </div>
                                <Link className="mini-link" to={`/hod/review/clo/${id}`}>
                                    Mở
                                </Link>
                            </div>

                            <div className={`check ${progress?.viewed_version ? "ok" : "no"}`}>
                                <span className="dot" />
                                <div className="check-body">
                                    <div className="check-title">Đã xem thay đổi phiên bản</div>
                                    <div className="check-sub">Nắm các thay đổi quan trọng.</div>
                                </div>
                                <Link className="mini-link" to={`/hod/review/version/${id}`}>
                                    Mở
                                </Link>
                            </div>

                            <div className={`check ${progress?.handled_feedback ? "ok" : "no"}`}>
                                <span className="dot" />
                                <div className="check-body">
                                    <div className="check-title">Đã xử lý phản biện chuyên môn</div>
                                    <div className="check-sub">
                                        Ưu tiên đóng góp ý "High" trước.
                                    </div>
                                </div>
                                <button className="mini-link" onClick={() => setActiveTab("threads")}>
                                    Xem
                                </button>
                            </div>

                            {!isChecklistOk && (
                                <div className="warn">
                                    Checklist chưa hoàn tất. Bạn vẫn có thể submit nhưng nên hoàn tất để đảm bảo chất lượng.
                                </div>
                            )}
                        </div>

                        {/* Stats */}
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
                        </div>
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
                                    <b>Tiếp tục sang Decision (đánh giá cuối)</b>
                                    <div className="hint">
                                        Đề cương đạt yêu cầu sau phản biện, tiếp tục đánh giá cuối.
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
                                Quay lại Pending
                            </button>
                            <button className="btn btn-primary" onClick={handleSubmitDecision}>
                                {decision === "forward_aa" ? "Tiếp tục Decision →" : "Gửi tổng hợp"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
