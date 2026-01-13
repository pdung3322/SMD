import "../dashboard.css";

export default function ApprovalResult() {
  return (
    <div className="academic-affairs-dashboard">
      {/* TITLE */}
      <h1 className="page-title">Thông báo kết quả duyệt đề cương</h1>

      {/* TABLE */}
      <div className="dashboard-section">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Môn học</th>
              <th>Người tạo</th>
              <th>Kết quả</th>
              <th>Ngày duyệt</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Lập trình Web</td>
              <td>Nguyễn Văn Chiến</td>
              <td className="status approved">Đã duyệt</td>
              <td>05/01/2026</td>
              <td>
                <button className="action-btn">Gửi thông báo</button>
              </td>
            </tr>

            <tr>
              <td>Công nghệ phần mềm</td>
              <td>Trần Thị B</td>
              <td className="status pending">Từ chối</td>
              <td>04/01/2026</td>
              <td>
                <button className="action-btn">Gửi thông báo</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}