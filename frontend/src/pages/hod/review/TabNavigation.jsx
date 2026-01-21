// TabNavigation component - Shared navigation bar cho các trang review
import { Link, useLocation } from "react-router-dom";
import "./evaluate.css";

export default function TabNavigation({ syllabusId }) {
    const location = useLocation();

    return (
        <div className="tabs-navigation">
            {/* TAB 1: NỘI DUNG */}
            <Link
                to={`/hod/review/evaluate/${syllabusId}`}
                className={`tab-button ${location.pathname.includes('/evaluate/') ? "active" : ""}`}
            >
                📄 Nội dung giáo trình
            </Link>

            {/* TAB 2: CLO */}
            <Link
                to={`/hod/review/clo/${syllabusId}`}
                className={`tab-button ${location.pathname.includes('/clo/') ? "active" : ""}`}
            >
                🎯 CLO
            </Link>

            {/* TAB 3: VERSION */}
            <Link
                to={`/hod/review/version/${syllabusId}`}
                className={`tab-button ${location.pathname.includes('/version/') ? "active" : ""}`}
            >
                📋 Version
            </Link>

            {/* TAB 4: PHẢN HỒI CỘNG TÁC */}
            <Link
                to={`/hod/collaborative-review/${syllabusId}`}
                className={`tab-button ${location.pathname.includes('/collaborative-review/') ? "active" : ""}`}
            >
                💬 Phản hồi cộng tác
            </Link>

            {/* TAB 5: QUYẾT ĐỊNH */}
            <Link
                to={`/hod/review/decision/${syllabusId}`}
                className={`tab-button ${location.pathname.includes('/decision/') ? "active" : ""}`}
            >
                ✓ Phê duyệt
            </Link>
        </div>
    );
}
