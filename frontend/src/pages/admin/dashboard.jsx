import "./dashboard.css";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      {/* TITLE */}
      <h1 className="page-title">Bảng điều khiển hệ thống</h1>

      {/* KPI */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-value">6</div>
          <div className="kpi-label">Người dùng</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-value">12</div>
          <div className="kpi-label">Đề cương</div>
        </div>

        <div className="kpi-card warning">
          <div className="kpi-value">4</div>
          <div className="kpi-label">Chờ duyệt</div>
        </div>

        <div className="kpi-card success">
          <div className="kpi-value">6</div>
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
