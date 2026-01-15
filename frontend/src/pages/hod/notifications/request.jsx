import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./notifications.css";

/**
 * REQUEST.jsx - Notification: Yêu cầu chỉnh sửa từ Collaborative Review
 * 
 * Luồng:
 * 1. HOD tạo Collaborative Review (tập hợp các Lecturer để review)
 * 2. Lecturer gửi feedback/yêu cầu chỉnh sửa
 * 3. HOD nhận thông báo "Có yêu cầu chỉnh sửa từ collaborative review"
 * 4. HOD xem chi tiết yêu cầu, sau đó gửi lại cho Lecturer để fix hoặc forward tới Academic Affairs
 * 
 * API cần:
 * - GET /hod/notifications/requests (Danh sách yêu cầu chỉnh sửa)
 * - GET /hod/collaborative-reviews/{review_id}/feedback (Chi tiết feedback)
 * - PATCH /hod/notifications/requests/{request_id}/resolve (Đánh dấu đã xử lý)
 */

export default function RequestNoti() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null); // Để expand chi tiết feedback
    const [filter, setFilter] = useState("ALL"); // ALL | PENDING | RESOLVED

    const currentUser = JSON.parse(localStorage.getItem("user")) || {};

    /* ===== LOAD DATA ===== */
    useEffect(() => {
        // MOCK DATA
        const mockRequests = [
            {
                request_id: 1,
                syllabus_id: 1,
                collaborative_review_id: 101,
                course_code: "MTH101",
                course_name: "Toán Cao Cấp",
                lecturer_name: "Nguyễn Văn A",
                faculty_name: "Khoa Toán",
                review_end_date: "2026-01-12",
                feedback_count: 3,
                status: "PENDING_HOD_ACTION", // PENDING_HOD_ACTION | RESOLVED
                feedbacks: [
                    {
                        feedback_id: 1,
                        reviewer_name: "Trần Anh X",
                        reviewer_role: "Lecturer",
                        comment: "Nên cập nhật thêm tài liệu tham khảo tiếng Anh",
                        created_at: "2026-01-11",
                    },
                    {
                        feedback_id: 2,
                        reviewer_name: "Lê Hải Y",
                        reviewer_role: "Lecturer",
                        comment: "CLO không rõ ràng, cần mở rộng giải thích",
                        created_at: "2026-01-11",
                    },
                    {
                        feedback_id: 3,
                        reviewer_name: "Phạm Linh Z",
                        reviewer_role: "Lecturer",
                        comment: "Tiêu chí đánh giá cần align với PLO",
                        created_at: "2026-01-12",
                    },
                ],
                created_at: "2026-01-12",
            },
            {
                request_id: 2,
                syllabus_id: 2,
                collaborative_review_id: 102,
                course_code: "WEB201",
                course_name: "Lập Trình Web",
                lecturer_name: "Trần Thị B",
                faculty_name: "Khoa CNTT",
                review_end_date: "2026-01-15",
                feedback_count: 2,
                status: "PENDING_HOD_ACTION",
                feedbacks: [
                    {
                        feedback_id: 4,
                        reviewer_name: "Huỳnh Minh K",
                        reviewer_role: "Lecturer",
                        comment: "Bài tập lab cần cập nhật công nghệ mới nhất",
                        created_at: "2026-01-12",
                    },
                    {
                        feedback_id: 5,
                        reviewer_name: "Võ Diệu L",
                        reviewer_role: "Lecturer",
                        comment: "Deadline project quá gần, cần kéo dài thêm",
                        created_at: "2026-01-13",
                    },
                ],
                created_at: "2026-01-12",
            },
            {
                request_id: 3,
                syllabus_id: 3,
                collaborative_review_id: 103,
                course_code: "DBI202",
                course_name: "Cơ Sở Dữ Liệu",
                lecturer_name: "Lê Văn C",
                faculty_name: "Khoa CNTT",
                review_end_date: "2026-01-18",
                feedback_count: 1,
                status: "RESOLVED",
                feedbacks: [
                    {
                        feedback_id: 6,
                        reviewer_name: "Ngô Thanh M",
                        reviewer_role: "Lecturer",
                        comment: "Nội dung chi tiết hơn là tốt",
                        created_at: "2026-01-13",
                    },
                ],
                created_at: "2026-01-11",
            },
        ];

        setRequests(mockRequests);
        setLoading(false);

        // REAL API
        // axios
        //   .get("/hod/notifications/requests", {
        //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        //   })
        //   .then((res) => {
        //     setRequests(res.data);
        //     setLoading(false);
        //   })
        //   .catch((err) => {
        //     console.error("Load requests error:", err);
        //     setError("Không thể tải yêu cầu. Vui lòng thử lại.");
        //     setLoading(false);
        //   });
    }, []);

    /* ===== FILTER ===== */
    const filteredRequests = requests.filter((req) => {
        if (filter === "PENDING") return req.status === "PENDING_HOD_ACTION";
        if (filter === "RESOLVED") return req.status === "RESOLVED";
        return true; // ALL
    });

    /* ===== HANDLE RESOLVE REQUEST ===== */
    const handleResolveRequest = (request_id) => {
        // TODO: API PATCH /hod/notifications/requests/{request_id}/resolve
        setRequests((prev) =>
            prev.map((r) =>
                r.request_id === request_id
                    ? { ...r, status: "RESOLVED" }
                    : r
            )
        );
        alert("Yêu cầu đã được đánh dấu là đã xử lý!");
    };

    /* ===== RENDER ===== */
    if (loading) return <div className="notifications-page">Đang tải yêu cầu...</div>;
    if (error) return <div className="notifications-page error">{error}</div>;

    return (
        <div className="notifications-page">
            <h1>🔄 Yêu cầu Chỉnh sửa từ Collaborative Review</h1>
            <p className="subtitle">
                Danh sách feedback từ các Lecturer trong phiên Collaborative Review
            </p>

            {/* FILTER */}
            <div className="filter-bar">
                <button
                    className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
                    onClick={() => setFilter("ALL")}
                >
                    Tất cả ({requests.length})
                </button>
                <button
                    className={`filter-btn ${filter === "PENDING" ? "active" : ""}`}
                    onClick={() => setFilter("PENDING")}
                >
                    ⏳ Chờ xử lý ({requests.filter((r) => r.status === "PENDING_HOD_ACTION").length})
                </button>
                <button
                    className={`filter-btn ${filter === "RESOLVED" ? "active" : ""}`}
                    onClick={() => setFilter("RESOLVED")}
                >
                    ✅ Đã xử lý ({requests.filter((r) => r.status === "RESOLVED").length})
                </button>
            </div>

            {/* REQUEST LIST */}
            {filteredRequests.length === 0 ? (
                <div className="empty-state">
                    <p>✅ Không có yêu cầu chỉnh sửa</p>
                </div>
            ) : (
                <div className="notification-list">
                    {filteredRequests.map((req) => (
                        <div
                            key={req.request_id}
                            className={`notification-card ${req.status === "PENDING_HOD_ACTION" ? "pending" : "resolved"}`}
                        >
                            {/* Status badge */}
                            <span className={`status-badge ${req.status}`}>
                                {req.status === "PENDING_HOD_ACTION" ? "⏳ Chờ xử lý" : "✅ Đã xử lý"}
                            </span>

                            {/* Header */}
                            <div className="notif-header">
                                <h3 className="course-name">
                                    {req.course_code} - {req.course_name}
                                </h3>
                                <p className="meta">
                                    <strong>Lecturer:</strong> {req.lecturer_name} ({req.faculty_name})
                                </p>
                                <p className="meta">
                                    <strong>Kết thúc Collaborative Review:</strong> {new Date(req.review_end_date).toLocaleDateString("vi-VN")} |
                                    <strong> Số feedback:</strong> {req.feedback_count}
                                </p>
                            </div>

                            {/* Feedback list (collapsible) */}
                            <div className="feedback-section">
                                <button
                                    className="feedback-toggle"
                                    onClick={() =>
                                        setExpandedId(expandedId === req.request_id ? null : req.request_id)
                                    }
                                >
                                    {expandedId === req.request_id ? "▼" : "▶"} Chi tiết feedback ({req.feedback_count})
                                </button>

                                {expandedId === req.request_id && (
                                    <div className="feedback-list">
                                        {req.feedbacks.map((fb) => (
                                            <div key={fb.feedback_id} className="feedback-item">
                                                <p className="feedback-author">
                                                    <strong>{fb.reviewer_name}</strong> ({fb.reviewer_role}) -{" "}
                                                    {new Date(fb.created_at).toLocaleDateString("vi-VN")}
                                                </p>
                                                <p className="feedback-content">"{fb.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="notif-actions">
                                <Link
                                    to={`/hod/review/evaluate/${req.syllabus_id}`}
                                    className="btn btn-primary"
                                >
                                    🔍 Xem & Quyết định
                                </Link>
                                {req.status === "PENDING_HOD_ACTION" && (
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handleResolveRequest(req.request_id)}
                                    >
                                        ✓ Đánh dấu đã xử lý
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
