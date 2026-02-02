import "./dashboard.css";

export default function LecturerDashboard() {
  return (
    <div className="lecturer-dashboard">
      {/* PAGE TITLE */}
      <h1 className="page-title">Tổng quan giảng viên</h1>

      {/* KPI */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-value">6</div>
          <div className="kpi-label">Giáo trình đã tạo</div>
        </div>

        <div className="kpi-card warning">
          <div className="kpi-value">2</div>
          <div className="kpi-label">Chờ phê duyệt</div>
        </div>

        <div className="kpi-card success">
          <div className="kpi-value">3</div>
          <div className="kpi-label">Đã được duyệt</div>
        </div>

        <div className="kpi-card info">
          <div className="kpi-value">1</div>
          <div className="kpi-label">Cần chỉnh sửa</div>
        </div>
      </div>

      {/* NOTICE */}
      <div className="dashboard-section">
        <h2>Thông báo</h2>

        <ul className="notice-list">
          <li className="notice warning">
            Giáo trình <b>Cơ sở dữ liệu</b> cần chỉnh sửa theo phản hồi.
          </li>
          <li className="notice info">
            Giáo trình <b>Công nghệ phần mềm</b> đang chờ phê duyệt.
          </li>
          <li className="notice success">
            Giáo trình <b>Lập trình Web</b> đã được phê duyệt.
          </li>
        </ul>
      </div>

      {/* MY SYLLABUS */}
      <div className="dashboard-section">
        <h2>Giáo trình của tôi</h2>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Học phần</th>
              <th>Phiên bản</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Lập trình Web</td>
              <td>v1.2</td>
              <td className="status approved">Đã duyệt</td>
              <td className="action-link">Xem</td>
            </tr>

            <tr>
              <td>Công nghệ phần mềm</td>
              <td>v1.0</td>
              <td className="status pending">Chờ duyệt</td>
              <td className="action-link">Chỉnh sửa</td>
            </tr>

            <tr>
              <td>Cơ sở dữ liệu</td>
              <td>v0.9</td>
              <td className="status rejected">Cần chỉnh sửa</td>
              <td className="action-link">Chỉnh sửa</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TIMELINE */}
      <div className="dashboard-section">
        <h2>Lịch sử hoạt động</h2>

        <ul className="timeline">
          <li>
            <span className="time">20/01/2026</span>
            Gửi giáo trình <b>Công nghệ phần mềm</b> để phê duyệt
          </li>
          <li>
            <span className="time">18/01/2026</span>
            Nhận phản hồi chỉnh sửa <b>Cơ sở dữ liệu</b>
          </li>
          <li>
            <span className="time">15/01/2026</span>
            Giáo trình <b>Lập trình Web</b> được phê duyệt
          </li>
        </ul>
      </div>
    </div>
  );
}
