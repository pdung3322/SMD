import "../dashboard.css";

export default function PloManagement() {
  return (
    <div className="academic-affairs-dashboard">
      {/* TITLE */}
      <h1 className="page-title">Quản lý chuẩn đầu ra chương trình (PLO)</h1>

      {/* TABLE */}
      <div className="dashboard-section">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Mã PLO</th>
              <th>Mô tả PLO</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>PLO1</td>
              <td>Kiến thức cơ bản về lĩnh vực</td>
              <td className="status approved">Hoạt động</td>
              <td>
                <button className="action-btn">Chỉnh sửa</button>
                <button className="action-btn reject">Xóa</button>
              </td>
            </tr>

            <tr>
              <td>PLO2</td>
              <td>Kỹ năng thực hành chuyên môn</td>
              <td className="status approved">Hoạt động</td>
              <td>
                <button className="action-btn">Chỉnh sửa</button>
                <button className="action-btn reject">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}