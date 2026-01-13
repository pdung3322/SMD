import "../dashboard.css";

export default function RejectedOrEdit() {
  return (
    <div className="academic-affairs-dashboard">
      {/* TITLE */}
      <h1 className="page-title">Thông báo đề cương bị từ chối hoặc yêu cầu chỉnh sửa</h1>

      {/* TABLE */}
      <div className="dashboard-section">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Môn học</th>
              <th>Người tạo</th>
              <th>Lý do</th>
              <th>Ngày từ chối</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Lập trình Web</td>
              <td>Nguyễn Văn Chiến</td>
              <td>Thiếu thông tin PLO</td>
              <td>05/01/2026</td>
              <td>
                <button className="action-btn">Gửi thông báo</button>
              </td>
            </tr>

            <tr>
              <td>Công nghệ phần mềm</td>
              <td>Trần Thị B</td>
              <td>Cần chỉnh sửa nội dung</td>
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