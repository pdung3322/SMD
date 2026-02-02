import "./dashboard.css";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      {/* TITLE */}
      <h1 className="page-title">Bảng điều khiển hệ thống</h1>

      {/* KPI */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-value">13</div>
          <div className="kpi-label">Người dùng</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-value">25</div>
          <div className="kpi-label">Giáo trình</div>
        </div>

        <div className="kpi-card warning">
          <div className="kpi-value">4</div>
          <div className="kpi-label">Chờ duyệt</div>
        </div>

        <div className="kpi-card success">
          <div className="kpi-value">21</div>
          <div className="kpi-label">Đã duyệt</div>
        </div>
      </div>

      {/* RECENT TABLE */}
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
              <td>Lê Minh Tâm</td>
              <td className="status approved">Đã duyệt</td>
              <td>03/01/2026</td>
            </tr>

            <tr>
              <td>Kiến trúc phần mềm</td>
              <td>Phạm Quốc Huy</td>
              <td className="status pending">Chờ duyệt</td>
              <td>02/01/2026</td>
            </tr>

            <tr>
              <td>Trí tuệ nhân tạo</td>
              <td>Nguyễn Thị Lan</td>
              <td className="status approved">Đã duyệt</td>
              <td>01/01/2026</td>
            </tr>

            <tr>
              <td>Phân tích & Thiết kế HT</td>
              <td>Đặng Quốc Bảo</td>
              <td className="status pending">Chờ duyệt</td>
              <td>31/12/2025</td>
            </tr>

            <tr>
              <td>Hệ điều hành</td>
              <td>Võ Minh Quân</td>
              <td className="status approved">Đã duyệt</td>
              <td>30/12/2025</td>
            </tr>

            <tr>
              <td>Mạng máy tính</td>
              <td>Phan Thị Ngọc</td>
              <td className="status approved">Đã duyệt</td>
              <td>29/12/2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
