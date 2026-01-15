import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./evaluate.css";


export default function Evaluate() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [syllabus, setSyllabus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState(5);
    const [decision, setDecision] = useState("");

    useEffect(() => {
        const mockSyllabus = {
            id: id,
            course_name: "Toán Cao Cấp",
            faculty_name: "Khoa Toán",
            content: "Nội dung chi tiết đề cương...",
            submitted_date: "2024-01-01",
            status: "pending"
        };
        setSyllabus(mockSyllabus);
        setLoading(false);

    }, [id]);

    //hàm xử lý submit form
    const handleSubmit = () => {
        if (!decision) {
            alert("Vui lòng chọn quyết định đánh giá.");
            return;
        }

        console.log("Submit evaluation:", { id, feedback, rating, decision });
        alert("Đánh giá đã được gửi!");
        navigate("/hod/review/pending");
    };


    if (loading) return <div className="evaluate-page">Đang tải...</div>;
    if (!syllabus) return <div className="evaluate-page">Không tìm thấy đề cương.</div>;



    return (
        <div className="evaluate-page">

            <h1 className="evaluate-title">Đánh giá đề cương: {syllabus.course_name}</h1>

            {/* chi tiết đề cương */}
            <div className="evaluate-card">
                <h3>Thông tin đề cương</h3>
                <p><strong>Môn học:</strong>{syllabus.course_name}</p>
                <p><strong>Khoa:</strong>{syllabus.faculty_name}</p>
                <p><strong>Ngày nộp:</strong>{new Date(syllabus.submitted_date).toLocaleDateString()}</p>
                <p><strong>Nội dung:</strong>{syllabus.content}</p>
            </div>

            {/* form đánh giá */}
            <div className="evaluate-card">
                <h3>Đánh giá của bạn</h3>
                <label>
                    Mức độ tuân thủ đề cương  (1-10):
                    <input
                        type="number"
                        min="1" max="10"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        style={{ width: '60px' }}
                    />
                </label>
                <label> 2
                    Phản hồi:
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Nhập phản hồi chi tiết..."
                        rows={5}
                    />
                </label>
                <div className="decision-options">
                    <label>
                        <input
                            type="radio"
                            name="decision"
                            value="approve"
                            onChange={(e) => setDecision(e.target.value)}
                        />
                        Phê duyệt
                    </label>
                    <label>
                        <input type="radio" name="decision" value="reject" onChange={(e) => setDecision(e.target.value)} />
                        Từ chối
                    </label>
                    <label>
                        <input type="radio" name="decision" value="require_edit" onChange={(e) => setDecision(e.target.value)} />
                        Yêu cầu chỉnh sửa
                    </label>
                </div>
            </div>
            {/* nút */}
            <div className="evaluate-actions">
                <button onClick={() => navigate("/hod/review/pending")}
                    className="btn-secondary">Quay lại</button>
                <button onClick={handleSubmit} className="btn-submit">Gửi đánh giá</button>
            </div>
        </div>
    );
}
