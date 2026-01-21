import "./dashboard.css";

export default function AcademicAffairsDashboard() {
    return (
        <div className="academic-affairs-dashboard">
            <h1 className="page-title">Bảng điều khiển Phòng đào tạo</h1>
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-value">4</div>
                    <div className="kpi-label">Đề cương chờ duyệt</div>
                </div>

                <div className="kpi-card success">
                    <div className="kpi-value">8</div>
                    <div className="kpi-label">Đề cương đã duyệt</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-value">5</div>
                    <div className="kpi-label">PLO quản lý</div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-value">3</div>
                    <div className="kpi-label">Chương trình đào tạo</div>
                </div>
            </div>

            <div className="dashboard-section">
                <h2>Hoạt động gần đây</h2>

                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Môn học</th>
                            <th>Người tạo</th>
                            <th>Trạng thái</th>
                            <th>Thời gian</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>Lập trình Web</td>
                            <td>Nguyễn Văn Chiến</td>
                            <td className="status pending">Chờ duyệt</td>
                            <td>05/01/2026</td>
                        </tr>

                        <tr>
                            <td>Công nghệ phần mềm</td>
                            <td>Trần Thị B</td>
                            <td className="status approved">Đã duyệt</td>
                            <td>04/01/2026</td>
                        </tr>

                        <tr>
                            <td>Cơ sở dữ liệu</td>
                            <td>Lê Văn C</td>
                            <td className="status approved">Đã duyệt</td>
                            <td>03/01/2026</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}