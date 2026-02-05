// TabNavigation component - Shared navigation bar cho các trang review
import { Link, useLocation } from "react-router-dom";
import "./detail.css";

export default function TabNavigation({ syllabusId }) {
    const location = useLocation();

    const handleLinkClick = (target) => {
        console.log("Link clicked:", target, "Current location:", location.pathname);
    };

    return (
        <div className="tabs-navigation">
            {/* TAB 1: NỘI DUNG */}
            <Link
                to={`/hod/review/detail/${syllabusId}`}
                onClick={() => handleLinkClick(`/hod/review/detail/${syllabusId}`)}
                className={`tab-button ${location.pathname.includes('/detail/') ? "active" : ""}`}
            >
                📄 Nội dung giáo trình
            </Link>

            {/* TAB 2: CLO */}
            <Link
                to={`/hod/review/clo/${syllabusId}`}
                onClick={() => handleLinkClick(`/hod/review/clo/${syllabusId}`)}
                className={`tab-button ${location.pathname.includes('/clo/') ? "active" : ""}`}
            >
                🎯 CLO
            </Link>

            {/* TAB 3: PHẢN HỒI CỘNG TÁC */}
            <Link
                to={`/hod/collaborative-review/${syllabusId}`}
                onClick={() => handleLinkClick(`/hod/collaborative-review/${syllabusId}`)}
                className={`tab-button ${location.pathname.includes('/collaborative-review/') ? "active" : ""}`}
            >
                💬 Phản hồi cộng tác
            </Link>

            {/* TAB 4: QUYẾT ĐỊNH */}
            <Link
                to={`/hod/review/decision/${syllabusId}`}
                onClick={() => handleLinkClick(`/hod/review/decision/${syllabusId}`)}
                className={`tab-button ${location.pathname.includes('/decision/') ? "active" : ""}`}
            >
                ✓ Phê duyệt
            </Link>
        </div>
    );
}
