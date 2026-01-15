import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./notifications.css";

/**
 * REVIEWRESULT.jsx - Notification: Kết quả phản biện từ cấp cao hơn
 * 
 * Luồng:
 * 1. HOD phê duyệt và forward Syllabus tới Academic Affairs (AA)
 * 2. AA hoặc Principal review và có 3 kết quả:
 *    - APPROVED: Phê duyệt, Syllabus hoàn tất
 *    - REJECTED: Từ chối, gửi lại cho HOD để revision
 *    - REQUIRE_REVISION: Yêu cầu chỉnh sửa, gửi lại cho HOD/Lecturer
 * 3. HOD nhận thông báo với kết quả
 * 4. Nếu REJECTED/REQUIRE_REVISION, HOD có thể:
 *    - Xem chi tiết ý kiến từ AA/Principal
 *    - Gửi lại cho Lecturer để chỉnh sửa
 *    - Re-submit tới AA
 * 
 * API cần:
 * - GET /hod/notifications/review-results (Danh sách kết quả phản biện)
 * - GET /hod/review-results/{result_id} (Chi tiết kết quả)
 * - PATCH /hod/notifications/review-results/{result_id}/view (Đánh dấu đã xem)
 */

export default function ReviewResult() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("ALL"); // ALL | APPROVED | REJECTED | REVISION_NEEDED

    const currentUser = JSON.parse(localStorage.getItem("user")) || {};

    /* ===== LOAD DATA ===== */
    useEffect(() => {
        // MOCK DATA
        const mockResults = [
            {
                result_id: 1,
                syllabus_id: 1,
                course_code: "MTH101",
                course_name: "Toán Cao Cấp",
                lecturer_name: "Nguyễn Văn A",
                faculty_name: "Khoa Toán",
                reviewed_by: "Trần Văn Chủ tịch AA",
                reviewer_role: "ACADEMIC_AFFAIRS",
                decision: "APPROVED", // APPROVED | REJECTED | REQUIRE_REVISION
                comment: "Đề cương hoàn hảo, phê duyệt chính thức",
                reviewed_date: "2026-01-13",
                is_read: false,
                next_action: "Syllabus hoàn tất, ready for academic year",
            },
            {
                result_id: 2,
                syllabus_id: 2,
                course_code: "WEB201",
                course_name: "Lập Trình Web",
                lecturer_name: "Trần Thị B",
                faculty_name: "Khoa CNTT",
                reviewed_by: "Phó Hiệu trưởng X",
                reviewer_role: "PRINCIPAL",
                decision: "REQUIRE_REVISION",
                comment: "Cần bổ sung thêm practical project về cybersecurity. Tham khảo khóa trước.",
                reviewed_date: "2026-01-12",
                is_read: false,
                next_action: "Gửi lại cho Lecturer để chỉnh sửa",
                revision_deadline: "2026-01-20",
            },
            {
                result_id: 3,
                syllabus_id: 3,
                course_code: "DBI202",
                course_name: "Cơ Sở Dữ Liệu",
                lecturer_name: "Lê Văn C",
                faculty_name: "Khoa CNTT",
                reviewed_by: "Trần Văn Chủ tịch AA",
                reviewer_role: "ACADEMIC_AFFAIRS",
                decision: "REJECTED",
                comment: "CLO không align với PLO. Cần xây dựng lại từ đầu.",
                reviewed_date: "2026-01-11",
                is_read: true,
                next_action: "Reject - Yêu cầu major revision từ Lecturer",
                revision_deadline: "2026-01-25",
            },
            {
                result_id: 4,
                syllabus_id: 4,
                course_code: "AI301",
                course_name: "Artificial Intelligence",
                lecturer_name: "Ngô Tú D",
                faculty_name: "Khoa CNTT",
                reviewed_by: "Trần Văn Chủ tịch AA",
                reviewer_role: "ACADEMIC_AFFAIRS",
                decision: "APPROVED",
                comment: "Xuất sắc! Approved.",
                reviewed_date: "2026-01-10",
                is_read: true,
                next_action: "Syllabus hoàn tất",
            },
        ];

        setResults(mockResults);
        setLoading(false);

        // REAL API
        // axios
        //   .get("/hod/notifications/review-results", {
        //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        //   })
        //   .then((res) => {
        //     setResults(res.data);
        //     setLoading(false);
        //   })
        //   .catch((err) => {
        //     console.error("Load review results error:", err);
        //     setError("Không thể tải kết quả phản biện. Vui lòng thử lại.");
        //     setLoading(false);
        //   });
    }, []);

    /* ===== FILTER ===== */
    const filteredResults = results.filter((res) => {
        if (filter === "APPROVED") return res.decision === "APPROVED";
        if (filter === "REJECTED") return res.decision === "REJECTED";
        if (filter === "REVISION_NEEDED") return res.decision === "REQUIRE_REVISION";
        return true; // ALL
    });

    /* ===== HANDLE MARK AS READ ===== */
    const handleMarkAsRead = (result_id) => {
        // TODO: API PATCH /hod/notifications/review-results/{result_id}/view
        setResults((prev) =>
            prev.map((r) =>
                r.result_id === result_id
                    ? { ...r, is_read: true }
                    : r
            )
        );
    };

    /* ===== RENDER ===== */
    if (loading) return <div className="notifications-page">Đang tải kết quả phản biện...</div>;
    if (error) return <div className="notifications-page error">{error}</div>;

    return (
        <div className="notifications-page">
            <h1>📊 Kết quả Phản biện từ Academic Affairs / Principal</h1>
            <p className="subtitle">
                Danh sách kết quả phản biện từ cấp cao hơn sau khi HOD forward
            </p>

            {/* FILTER */}
            <div className="filter-bar">
                <button
                    className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
                    onClick={() => setFilter("ALL")}
                >
                    Tất cả ({results.length})
                </button>
                <button
                    className={`filter-btn ${filter === "APPROVED" ? "active" : ""}`}
                    onClick={() => setFilter("APPROVED")}
                >
                    ✅ Phê duyệt ({results.filter((r) => r.decision === "APPROVED").length})
                </button>
                <button
                    className={`filter-btn ${filter === "REVISION_NEEDED" ? "active" : ""}`}
                    onClick={() => setFilter("REVISION_NEEDED")}
                >
                    🔧 Cần chỉnh sửa ({results.filter((r) => r.decision === "REQUIRE_REVISION").length})
                </button>
                <button
                    className={`filter-btn ${filter === "REJECTED" ? "active" : ""}`}
                    onClick={() => setFilter("REJECTED")}
                >
                    ❌ Từ chối ({results.filter((r) => r.decision === "REJECTED").length})
                </button>
            </div>

            {/* RESULT LIST */}
            {filteredResults.length === 0 ? (
                <div className="empty-state">
                    <p>📭 Không có kết quả phản biện</p>
                </div>
            ) : (
                <div className="notification-list">
                    {filteredResults.map((result) => (
                        <div
                            key={result.result_id}
                            className={`notification-card review-result ${result.decision.toLowerCase()} ${!result.is_read ? "unread" : ""}`}
                        >
                            {/* Decision badge */}
                            <span className={`decision-badge ${result.decision.toLowerCase()}`}>
                                {result.decision === "APPROVED" && "✅ PHÂN DUYỆT"}
                                {result.decision === "REQUIRE_REVISION" && "🔧 CẦN CHỈNH SỬA"}
                                {result.decision === "REJECTED" && "❌ TỪ CHỐI"}
                            </span>

                            {/* Header */}
                            <div className="notif-header">
                                <h3 className="course-name">
                                    {result.course_code} - {result.course_name}
                                </h3>
                                <p className="meta">
                                    <strong>Lecturer:</strong> {result.lecturer_name} ({result.faculty_name})
                                </p>
                                <p className="meta">
                                    <strong>Nhà phản biện:</strong> {result.reviewed_by} ({result.reviewer_role})
                                </p>
                                <p className="meta">
                                    <strong>Ngày phản biện:</strong> {new Date(result.reviewed_date).toLocaleDateString("vi-VN")}
                                </p>
                            </div>

                            {/* Reviewer comment */}
                            <div className="review-comment-section">
                                <h4>💬 Ý kiến phản biện:</h4>
                                <p className="comment-text">"{result.comment}"</p>
                            </div>

                            {/* Next action */}
                            <div className="next-action-section">
                                <p><strong>📋 Bước tiếp theo:</strong> {result.next_action}</p>
                                {result.revision_deadline && (
                                    <p className="deadline">
                                        <strong>📅 Hạn chỉnh sửa:</strong> {new Date(result.revision_deadline).toLocaleDateString("vi-VN")}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="notif-actions">
                                {result.decision === "REQUIRE_REVISION" && (
                                    <Link
                                        to={`/hod/review/evaluate/${result.syllabus_id}?mode=revision`}
                                        className="btn btn-warning"
                                    >
                                        🔧 Xử lý Chỉnh sửa
                                    </Link>
                                )}
                                {result.decision === "REJECTED" && (
                                    <Link
                                        to={`/hod/review/evaluate/${result.syllabus_id}?mode=rejected`}
                                        className="btn btn-danger"
                                    >
                                        ❌ Xem & Tái xử lý
                                    </Link>
                                )}
                                {result.decision === "APPROVED" && (
                                    <button className="btn btn-success" disabled>
                                        ✅ Hoàn tất
                                    </button>
                                )}
                                {!result.is_read && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => handleMarkAsRead(result.result_id)}
                                    >
                                        ✓ Đánh dấu đã đọc
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
