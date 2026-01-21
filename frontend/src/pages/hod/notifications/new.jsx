import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./notifications.css";

/**
 * NEW.jsx - Notification: Syllabus mới từ Lecturer
 * 
 * Luồng:
 * 1. Lecturer nộp Syllabus (status: SUBMITTED)
 * 2. HOD nhận thông báo "Syllabus mới đang chờ duyệt"
 * 3. HOD click vào item -> chuyển tới trang review/evaluate để duyệt hoặc yêu cầu chỉnh sửa
 * 
 * API cần:
 * - GET /hod/notifications/new (Danh sách Syllabus chờ duyệt)
 */

export default function NewNoti() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("ALL"); // ALL | PENDING | URGENT

    // Lấy thông tin user từ localStorage
    const currentUser = JSON.parse(localStorage.getItem("user")) || {};

    /* ===== LOAD DATA ===== */
    useEffect(() => {
        // MOCK DATA (khi backend chưa có)
        const mockNotifications = [
            {
                notification_id: 1,
                syllabus_id: 1,
                course_code: "MTH101",
                course_name: "Toán Cao Cấp",
                lecturer_name: "Nguyễn Văn A",
                faculty_name: "Khoa Toán",
                submitted_date: "2026-01-10",
                version: "v2",
                is_urgent: false,
                change_summary: "Cập nhật CLO và PLO",
                status: "PENDING_HOD_REVIEW",
            },
            {
                notification_id: 2,
                syllabus_id: 2,
                course_code: "WEB201",
                course_name: "Lập Trình Web",
                lecturer_name: "Trần Thị B",
                faculty_name: "Khoa CNTT",
                submitted_date: "2026-01-09",
                version: "v1",
                is_urgent: true,
                change_summary: "Syllabus mới lần đầu",
                status: "PENDING_HOD_REVIEW",
            },
            {
                notification_id: 3,
                syllabus_id: 3,
                course_code: "DBI202",
                course_name: "Cơ Sở Dữ Liệu",
                lecturer_name: "Lê Văn C",
                faculty_name: "Khoa CNTT",
                submitted_date: "2026-01-08",
                version: "v3",
                is_urgent: false,
                change_summary: "Điều chỉnh nội dung chương",
                status: "PENDING_HOD_REVIEW",
            },
        ];

        setNotifications(mockNotifications);
        setLoading(false);

        // REAL API (khi backend ready)
        // axios
        //   .get("/hod/notifications/new", {
        //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        //   })
        //   .then((res) => {
        //     setNotifications(res.data);
        //     setLoading(false);
        //   })
        //   .catch((err) => {
        //     console.error("Load notifications error:", err);
        //     setError("Không thể tải thông báo. Vui lòng thử lại.");
        //     setLoading(false);
        //   });
    }, []);

    /* ===== FILTER NOTIFICATIONS ===== */
    const filteredNotifications = notifications.filter((notif) => {
        if (filter === "URGENT") return notif.is_urgent;
        if (filter === "PENDING") return notif.status === "PENDING_HOD_REVIEW";
        return true; // ALL
    });

    /* ===== HANDLE MARK AS READ ===== */
    const handleMarkAsRead = (notification_id) => {
        // TODO: API PATCH /hod/notifications/{notification_id}/read
        setNotifications((prev) =>
            prev.map((n) =>
                n.notification_id === notification_id
                    ? { ...n, is_read: true }
                    : n
            )
        );
    };

    /* ===== RENDER ===== */
    if (loading) return <div className="notifications-page">Đang tải thông báo...</div>;
    if (error) return <div className="notifications-page error">{error}</div>;

    return (
        <div className="notifications-page">
            <h1>📬 Thông báo Đề cương Mới</h1>
            <p className="subtitle">Danh sách đề cương chờ HOD xử lý (Duyệt / Yêu cầu chỉnh sửa)</p>

            {/* FILTER */}
            <div className="filter-bar">
                <button
                    className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
                    onClick={() => setFilter("ALL")}
                >
                    Tất cả ({notifications.length})
                </button>
                <button
                    className={`filter-btn ${filter === "URGENT" ? "active" : ""}`}
                    onClick={() => setFilter("URGENT")}
                >
                    🔴 Cấp tốc ({notifications.filter((n) => n.is_urgent).length})
                </button>
                <button
                    className={`filter-btn ${filter === "PENDING" ? "active" : ""}`}
                    onClick={() => setFilter("PENDING")}
                >
                    ⏳ Chờ xử lý ({notifications.filter((n) => n.status === "PENDING_HOD_REVIEW").length})
                </button>
            </div>

            {/* NOTIFICATION LIST */}
            {filteredNotifications.length === 0 ? (
                <div className="empty-state">
                    <p>✅ Không có thông báo mới</p>
                </div>
            ) : (
                <div className="notification-list">
                    {filteredNotifications.map((notif) => (
                        <div
                            key={notif.notification_id}
                            className={`notification-card ${notif.is_urgent ? "urgent" : ""}`}
                        >
                            {/* Badge urgent */}
                            {notif.is_urgent && <span className="urgent-badge">🔴 CẤP TỐC</span>}

                            {/* Info */}
                            <div className="notif-header">
                                <h3 className="course-name">
                                    {notif.course_code} - {notif.course_name}
                                </h3>
                                <p className="meta">
                                    <strong>Lecturer:</strong> {notif.lecturer_name} ({notif.faculty_name})
                                </p>
                                <p className="meta">
                                    <strong>Ngày nộp:</strong> {new Date(notif.submitted_date).toLocaleDateString("vi-VN")} |
                                    <strong> Version:</strong> {notif.version}
                                </p>
                            </div>

                            {/* Change summary */}
                            <div className="change-summary">
                                <p><strong>📝 Thay đổi:</strong> {notif.change_summary}</p>
                            </div>

                            {/* Action buttons */}
                            <div className="notif-actions">
                                <Link
                                    to={`/hod/review/evaluate/${notif.syllabus_id}`}
                                    className="btn btn-primary"
                                >
                                    🔍 Xem chi tiết & Duyệt
                                </Link>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleMarkAsRead(notif.notification_id)}
                                >
                                    ✓ Đánh dấu đã đọc
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
