import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import axios from "axios";  // COMMENTED: Using mock data
import "./notifications.css";

/* ===== MOCK DATA FOR TESTING ===== */
const MOCK_NEW_NOTIFICATIONS = [

    {
        notification_id: 2,
        syllabus_id: 2,
        course_code: "WEB",
        course_name: "Lập Trình Web",
        lecturer_name: "Nguyễn Phương Anh",
        faculty_name: "Viện Công nghệ Thông tin và Điện – Điện tử",
        submitted_date: "2026-01-06",
        version: "v1",
        is_urgent: true,
        change_summary: "Syllabus version mới",
        status: "PENDING_HOD_REVIEW",
    },

    {
        notification_id: 1,
        syllabus_id: 1,
        course_code: "CTRR",
        course_name: "Cấu trúc Rời Rạc",
        lecturer_name: "Nguyễn Đúng",
        faculty_name: "Khoa Cơ Bản",
        submitted_date: "2026-01-10",
        version: "v2",
        is_urgent: false,
        change_summary: "Bản Cập nhật của v1",
        status: "PENDING_HOD_REVIEW",
    },
    {
        notification_id: 3,
        syllabus_id: 3,
        course_code: "CNPM",
        course_name: "Công nghệ phần mềm",
        lecturer_name: "Nguyễn Văn Quang",
        faculty_name: "Viện Công nghệ Thông tin và Điện – Điện tử",
        submitted_date: "2026-01-10",
        version: "v2",
        is_urgent: false,
        change_summary: "Bản Cập nhật của v1",
        status: "PENDING_HOD_REVIEW",
    },

];

/**
 * NEW.jsx - Notification: Syllabus mới từ Lecturer
 * 
 * Luồng:
 * 1. Lecturer nộp Syllabus (status: SUBMITTED)
 * 2. HOD nhận thông báo "Syllabus mới đang chờ duyệt"
 * 3. HOD click vào item -> chuyển tới trang review/evaluate để duyệt hoặc yêu cầu chỉnh sửa
 * 
 * API cần:
 * - GET /hod/notifications/new [COMMENTED - USING MOCK DATA]
 */

export default function NewNoti() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [reviewDeadlines, setReviewDeadlines] = useState({}); // {notification_id: deadline}

    // Lấy thông tin user từ localStorage
    const currentUser = JSON.parse(localStorage.getItem("user")) || {};

    /* ===== SYNC BELL COUNT ===== */
    const updateTotalCount = (countForPage) => {
        const stored = JSON.parse(localStorage.getItem("hodNotificationCounts")) || {};
        const updated = { ...stored, new: countForPage };
        const combinedTotal = (updated.new || 0) + (updated.request || 0) + (updated.reviewResult || 0);
        localStorage.setItem("hodNotificationCounts", JSON.stringify(updated));
        setTotalCount(combinedTotal);
    };

    /* ===== LOAD DATA ===== */
    useEffect(() => {
        /* COMMENTED OUT: Using mock data instead
        // MOCK DATA (khi backend chưa có)
        const mockNotifications = [
            ...
        ];
        */

        // Using mock data
        setNotifications(MOCK_NEW_NOTIFICATIONS);
        setLoading(false);
        updateTotalCount(MOCK_NEW_NOTIFICATIONS.length);
    }, []);

    /* ===== HANDLE OPEN COLLABORATIVE REVIEW ===== */
    const handleOpenCollaborativeReview = (notif) => {
        const deadline = reviewDeadlines[notif.notification_id];
        if (!deadline) {
            alert("Vui lòng chọn thời gian hết hạn phản biện");
            return;
        }

        // Lưu phiên collaborative review vào localStorage
        const sessionKey = `collab_review_${notif.syllabus_id}`;
        const session = {
            syllabus_id: notif.syllabus_id,
            course_code: notif.course_code,
            course_name: notif.course_name,
            lecturer_name: notif.lecturer_name,
            faculty_name: notif.faculty_name,
            review_deadline: deadline,
            created_at: new Date().toISOString().slice(0, 10),
            status: "ACTIVE",
        };
        localStorage.setItem(sessionKey, JSON.stringify(session));

        // Xóa từ danh sách notifications
        setNotifications((prev) => prev.filter((n) => n.notification_id !== notif.notification_id));
        updateTotalCount(notifications.length - 1);

        alert(`Đã mở phiên phản biện tới ${new Date(deadline).toLocaleDateString("vi-VN")}. Các GV trong khoa ${notif.faculty_name} có thể phản biện.`);
    };

    /* ===== RENDER ===== */
    if (loading) return <div className="notifications-page">Đang tải thông báo...</div>;
    if (error) return <div className="notifications-page error">{error}</div>;

    return (
        <div className="notifications-page">
            <div className="notifications-header">
                <div>
                    <h1>📬 Thông báo giáo trình mới</h1>
                    <p className="subtitle">Danh sách giáo trình chờ mở phản biện</p>
                </div>
                <div className="bell-indicator" aria-label="Tổng thông báo">
                    <span className="bell-icon">🔔</span>
                    <span className="bell-count">{totalCount}</span>
                </div>
            </div>

            {/* NOTIFICATION LIST */}
            {notifications.length === 0 ? (
                <div className="empty-state">
                    <p>✅ Không có thông báo mới</p>
                </div>
            ) : (
                <div className="notification-list">
                    {notifications.map((notif) => (
                        <div
                            key={notif.notification_id}
                            className="notification-card"
                        >
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
                                <p><strong> Thay đổi:</strong> {notif.change_summary}</p>
                            </div>

                            {/* Review deadline setup */}
                            <div className="notif-actions">
                                <div className="review-setup">
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
