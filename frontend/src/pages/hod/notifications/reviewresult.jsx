import { useEffect, useState } from "react";
import { getPendingSyllabus } from '../../../services/api';
import { Link } from "react-router-dom";
import "./reviewresult.css";

/**
 * REVIEWRESULT.jsx - Notification: Hoàn tất Phản biện
 * 
 * Luồng:
 * 1. HOD mở phiên Collaborative Review với deadline
 * 2. Các GV trong khoa phản biện cho đến hết deadline
 * 3. Khi hết deadline, thông báo chuyển sang trang này: "Hoàn tất phản biện"
 * 4. HOD click để xem kết quả phản biện và đi tới trang evaluate
 */

export default function ReviewResult() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    const currentUser = JSON.parse(localStorage.getItem("user")) || {};

    /* ===== SYNC BELL COUNT ===== */
    const updateTotalCount = (countForPage) => {
        const stored = JSON.parse(localStorage.getItem("hodNotificationCounts")) || {};
        const updated = { ...stored, reviewResult: countForPage };
        const combinedTotal = (updated.new || 0) + (updated.request || 0) + (updated.reviewResult || 0);
        localStorage.setItem("hodNotificationCounts", JSON.stringify(updated));
        setTotalCount(combinedTotal);
    };

    /* ===== LOAD DATA ===== */
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const hodId = currentUser?.id || 1;
                const data = await getPendingSyllabus(hodId);

                // Filter để lấy chỉ những items có status "review_completed"
                const reviewResults = data
                    .filter(item => item.status === "review_completed")
                    .map((item, idx) => ({
                        result_id: idx + 1,
                        syllabus_id: item.syllabus_id,
                        course_code: item.course_code,
                        course_name: item.course_name,
                        lecturer_name: item.lecturer_name,
                        faculty_name: item.faculty_name || "N/A",
                        review_end_date: new Date().toISOString().slice(0, 10),
                    }));

                setResults(reviewResults);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch review results:", err);
                setError("Không thể tải dữ liệu.");
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser?.id]);

    /* ===== RENDER ===== */
    if (loading) return <div className="notifications-page">Đang tải kết quả phản biện...</div>;
    if (error) return <div className="notifications-page error">{error}</div>;

    return (
        <div className="notifications-page">
            <div className="notifications-header">
                <div>
                    <h1>📊Thông báo hoàn tất phản biện</h1>
                    <p className="subtitle">Thông báo giáo trình đã hết hạn phản biện</p>
                </div>
                <div className="bell-indicator" aria-label="Tổng thông báo">
                    <span className="bell-icon">🔔</span>
                    <span className="bell-count">{totalCount}</span>
                </div>
            </div>

            {/* RESULT LIST */}
            {results.length === 0 ? (
                <div className="empty-state">
                    <p>✅ Không có giáo trình nào hoàn tất phản biện</p>
                </div>
            ) : (
                <div className="notification-list">
                    {results.map((result) => (
                        <div
                            key={result.result_id}
                            className="notification-card"
                        >
                            {/* Header */}
                            <div className="notif-header">
                                <h3 className="course-name">
                                    {result.course_code} - {result.course_name}
                                </h3>
                                <p className="meta">
                                    <strong>Lecturer:</strong> {result.lecturer_name} ({result.faculty_name})
                                </p>
                            </div>

                            {/* Notification message */}
                            <div className="review-comment-section">
                                <h4> Thông báo:</h4>
                                <p className="comment-text">Phản biện đã kết thúc vào {new Date(result.review_end_date).toLocaleDateString("vi-VN")}. Sẵn sàng để đánh giá.</p>
                            </div>

                            {/* Action button */}
                            <div className="notif-actions">
                                <Link
                                    to={`/hod/review/evaluate/${result.syllabus_id}`}
                                    className="btn btn-primary"
                                >
                                    Chuyển sang nội dung giáo trình
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
