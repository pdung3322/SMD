import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function CollaborativeReviewIndex() {
    const navigate = useNavigate();
    const hasShownAlert = useRef(false);

    useEffect(() => {
        if (!hasShownAlert.current) {
            hasShownAlert.current = true;
            alert("Vui lòng chọn giáo trình để xem");
            navigate("/hod/review/pending");
        }
    }, [navigate]);

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <p>Đang chuyển hướng...</p>
        </div>
    );
}
