import "../dashboard.css";

export default function ProgramStructure() {
  return (
    <div className="academic-affairs-dashboard">
      {/* TITLE */}
      <h1 className="page-title">Quản lý cấu trúc chương trình đào tạo</h1>

      {/* TABLE */}
      <div className="dashboard-section">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Môn học</th>
              <th>Học kỳ</th>
              <th>Tín chỉ</th>
              <th>Điều kiện tiên quyết</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Lập trình Web</td>
              <td>Học kỳ 5</td>
              <td>3</td>
              <td>Cơ sở dữ liệu</td>
              <td>
                <button className="action-btn">Chỉnh sửa</button>
                <button className="action-btn reject">Xóa</button>
              </td>
            </tr>

            <tr>
              <td>Công nghệ phần mềm</td>
              <td>Học kỳ 6</td>
              <td>4</td>
              <td>Lập trình Web</td>
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