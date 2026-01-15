import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./collaborative.css";

/**
 * FEEDBACK (HOD) - Phản biện chuyên môn (dạng thread comment)
 *
 * WHY this UI:
 * - Review system thường dùng thread + status + filter + timeline.
 * - HOD xem nhanh ai góp ý, góp ý thuộc mục nào, đã xử lý/chưa.
 *
 * ROUTE:
 * - /hod/review/feedback        (không id -> chọn đề cương)
 * - /hod/review/feedback/:id    (có id -> xem feedback của đề cương)
 *
 * TODO BACKEND:
 * - GET  /syllabus/pending-lite (để list chọn)
 * - GET  /syllabus/:id/feedback-threads
 * - POST /syllabus/:id/feedback-threads (reply / resolve / pin...)
 */

export default function Feedback() {
    const { id } = useParams(); // có thể undefined
    const navigate = useNavigate();

    // list chọn đề cương (khi chưa có id)
    const [pickList, setPickList] = useState([]);

    // meta đề cương đang xem
    const [syllabus, setSyllabus] = useState(null);

    // threads
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);

    // filters
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("ALL"); // ALL | open | resolved
    const [section, setSection] = useState("ALL"); // ALL | CLO | Assessment | Content | Materials
    const [sort, setSort] = useState("latest"); // latest | oldest

    // local action mock
    const [replyDraft, setReplyDraft] = useState({}); // { [threadId]: "text" }

    useEffect(() => {
        setLoading(true);

        // ===== MOCK list để chọn khi chưa có id =====
        const mockPick = [
            { id: 1, course_name: "Toán Cao Cấp", faculty_name: "Khoa Toán" },
            { id: 2, course_name: "Lập Trình Web", faculty_name: "Khoa CNTT" },
        ];
        setPickList(mockPick);

        // Nếu chưa có id -> chỉ load pick list và dừng
        if (!id) {
            setSyllabus(null);
            setThreads([]);
            setLoading(false);
            return;
        }

        // ===== MOCK DATA THREADS =====
        // TODO (backend): axios.get(`/syllabus/${id}/feedback-threads`)
        const mockSyllabus = {
            id,
            course_name: id === "2" ? "Lập Trình Web" : "Toán Cao Cấp",
            faculty_name: id === "2" ? "Khoa CNTT" : "Khoa Toán",
            version: "v1",
            submitted_date: "2026-01-05",
        };

        const mockThreads = [
            {
                id: 101,
                section: "CLO",
                title: "CLO2 mô tả còn rộng",
                status: "open",
                priority: "medium", // low | medium | high
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

        setSyllabus(mockSyllabus);
        setThreads(mockThreads);
        setLoading(false);
    }, [id]);

    const filtered = useMemo(() => {
        let data = [...threads];

        // filter status
        if (status !== "ALL") data = data.filter((t) => t.status === status);

        // filter section
        if (section !== "ALL") data = data.filter((t) => t.section === section);

        // search
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

        // sort
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

    // ===== actions mock =====
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

    // ===== render =====
    if (loading) return <div className="fb-page">Đang tải...</div>;

    // ===== MODE: chưa có id -> chọn đề cương =====
    if (!id) {
        return (
            <div className="fb-page">
                <div className="fb-head">
                    <div>
                        <h1 className="fb-title">Phản biện chuyên môn</h1>
                        <p className="fb-sub">
                            Chọn một đề cương để xem các thread góp ý và xử lý.
                        </p>
                    </div>
                </div>

                <div className="fb-pick-card">
                    <div className="pick-label">Chọn đề cương</div>
                    <div className="pick-grid">
                        {pickList.map((s) => (
                            <button
                                key={s.id}
                                className="pick-item"
                                onClick={() => navigate(`/hod/review/feedback/${s.id}`)}
                            >
                                <div className="pick-name">{s.course_name}</div>
                                <div className="pick-meta">{s.faculty_name}</div>
                            </button>
                        ))}
                    </div>

                    <div className="fb-note">
                        TODO (backend): danh sách này lấy từ API “pending/under-review”.
                    </div>
                </div>
            </div>
        );
    }

    // ===== MODE: có id =====
    return (
        <div className="fb-page">
            {/* HEADER */}
            <div className="fb-head">
                <div>
                    <h1 className="fb-title">
                        Phản biện — {syllabus?.course_name}{" "}
                        <span className="fb-version">({syllabus?.version})</span>
                    </h1>
                    <p className="fb-sub">
                        Quản lý góp ý theo thread. Mục tiêu: đóng các góp ý quan trọng trước
                        khi tổng hợp và đánh giá.
                    </p>
                </div>

                <div className="fb-actions">
                    <Link to={`/hod/review/version/${id}`} className="btn btn-ghost">
                        ← Version
                    </Link>
                    <Link to={`/hod/review/summary/${id}`} className="btn btn-primary">
                        Tiếp theo: Summary →
                    </Link>
                </div>
            </div>

            {/* SUMMARY STRIP */}
            <div className="fb-strip">
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
            <div className="fb-filter">
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
                    <select
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                    >
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

            {/* THREADS */}
            <div className="fb-list">
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

            <div className="fb-note">
                TODO (backend): thread có thể gắn “anchor” tới section cụ thể trong đề cương,
                có mention người dùng, và có SLA thời hạn phản biện.
            </div>
        </div>
    );
}
