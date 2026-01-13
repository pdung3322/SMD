import "../dashboard.css";

export default function PendingApprovals() {
  return (
    <div className="academic-affairs-dashboard">
      {/* TITLE */}
      <h1 className="page-title">Danh sách đề cương chờ duyệt</h1>

      {/* TABLE */}
      <div className="dashboard-section">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Môn học</th>
              <th>Người tạo</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Lập trình Web</td>
              <td>Nguyễn Văn Chiến</td>
              <td>05/01/2026</td>
              <td className="status pending">Chờ duyệt</td>
              <td>
                <button className="action-btn">Xem chi tiết</button>
                <button className="action-btn approve">Duyệt</button>
                <button className="action-btn reject">Từ chối</button>
              </td>
            </tr>

            <tr>
              <td>Công nghệ phần mềm</td>
              <td>Trần Thị B</td>
              <td>04/01/2026</td>
              <td className="status pending">Chờ duyệt</td>
              <td>
                <button className="action-btn">Xem chi tiết</button>
                <button className="action-btn approve">Duyệt</button>
                <button className="action-btn reject">Từ chối</button>
              </td>
            </tr>

            <tr>
              <td>Cơ sở dữ liệu</td>
              <td>Lê Văn C</td>
              <td>03/01/2026</td>
              <td className="status pending">Chờ duyệt</td>
              <td>
                <button className="action-btn">Xem chi tiết</button>
                <button className="action-btn approve">Duyệt</button>
                <button className="action-btn reject">Từ chối</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}