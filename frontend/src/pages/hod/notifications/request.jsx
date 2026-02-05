import { useEffect, useState } from "react";
import { getPendingSyllabus } from "../../../services/api";
import { Link } from "react-router-dom";
import "./request.css";

/**
 * REQUEST.jsx - Notification: Phê duyệt/Từ chối từ Academic Affairs
 * 
 * Luồng:
 * 1. HOD gửi Syllabus tới Academic Affairs (AA) để review
 * 2. AA phê duyệt hoặc từ chối
 * 3. HOD nhận thông báo kết quả quyết định
 * 4. Nếu từ chối: nút "Gửi lại cho Lecturer" dẫn tới trang phê duyệt HOD để chuẩn bị gửi lại
 * 5. Nếu phê duyệt: thông báo hoàn tất
 */

export default function RequestNoti() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    const currentUser = JSON.parse(localStorage.getItem("user")) || {};

    /* ===== SYNC BELL COUNT ===== */
    const updateTotalCount = (countForPage) => {
        const stored = JSON.parse(localStorage.getItem("hodNotificationCounts")) || {};
        const updated = { ...stored, request: countForPage };
        const combinedTotal = (updated.new || 0) + (updated.request || 0) + (updated.reviewResult || 0);
        localStorage.setItem("hodNotificationCounts", JSON.stringify(updated));
        setTotalCount(combinedTotal);
    };

    /* ===== LOAD DATA ===== */
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const hodId = currentUser?.id || 1; // Lấy id từ user đang login
                const data = await getPendingSyllabus(hodId);

                // Filter để lấy chỉ những items có status APPROVED hoặc REJECTED 
                const filteredData = data
                    .filter(item => item.status === "approved" || item.status === "rejected")
                    .map((item, idx) => ({
                        request_id: idx + 1,
                        syllabus_id: item.syllabus_id,
                        course_code: item.course_code,
                        course_name: item.course_name,
                        lecturer_name: item.lecturer_name,
                        faculty_name: item.faculty_name || "N/A",
                        reviewed_bt: "Academic Affairs",
                        reviewed_role: "ACADEMIC_AFFAIRS",
                        decision: item.status === "approved" ? "APPROVED" : "REJECTED",
                        comment: "Quyết định từ phòng đào tạo",
                        reviewed_date: new Date().toISOString().slice(0, 10),
                    }));

                setRequests(filteredData);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch AA decisions:", err);
                setError("Không thể tải danh sách quyết định. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser?.id]);


    /* ===== RENDER ===== */
    if (loading) return <div className="notifications-page">Đang tải yêu cầu...</div>;
    if (error) return <div className="notifications-page error">{error}</div>;

    return (
        <div className="notifications-page">
            <div className="notifications-header">
                <div>
                    <h1>🔄Thống báo quyết định từ Academic Affairs</h1>
                </div>
                <div className="bell-indicator" aria-label="Tổng thông báo">
                    <span className="bell-icon">🔔</span>
                    <span className="bell-count">{totalCount}</span>
                </div>
            </div>

            {/* REQUEST LIST */}
            {requests.length === 0 ? (
                <div className="empty-state">
                    <p>✅ Không có thông báo mới</p>
                </div>
            ) : (
                <div className="notification-list">
                    {requests.map((req) => (
                        <div key={req.request_id} className="notification-card">
                            {/* Decision badge */}
                            <div className="decision-badge-container">
                                {req.decision === "APPROVED" ? (
                                    <span className="badge-approved">✅ PHÊ DUYỆT</span>
                                ) : (
                                    <span className="badge-rejected">❌ TỪ CHỐI</span>
                                )}
                            </div>

                            {/* Course info */}
                            <h3 className="course-name">{req.course_code} - {req.course_name}</h3>
                            <p className="meta"><strong>Lecturer:</strong> {req.lecturer_name}</p>

                            {/* Notification message box */}
                            <div className="review-comment-section">
                                <h4> Thông báo:</h4>
                                <p className="comment-text">{req.comment}</p>
                            </div>

                            {/* Action buttons */}
                            <div className="notif-actions">
                                {req.decision === "REJECTED" && (
                                    <Link
                                        to={`/hod/review/approve/${req.syllabus_id}`}
                                        className="btn btn-warning"
                                    >
                                        Gửi lại cho Lecturer
                                    </Link>
                                )}
                                {req.decision === "APPROVED" && (
                                    <button className="btn btn-success" disabled>
                                        Hoàn tất
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
