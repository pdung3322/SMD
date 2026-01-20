import "../dashboard.css";

export default function ProgramCourses() {
  return (
    <div className="academic-affairs-dashboard">
      {/* TITLE */}
      <h1 className="page-title">Quản lý học phần trong chương trình</h1>

      {/* TABLE */}
      <div className="dashboard-section">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Mã học phần</th>
              <th>Tên học phần</th>
              <th>Tín chỉ</th>
              <th>Loại học phần</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>CS101</td>
              <td>Lập trình Web</td>
              <td>3</td>
              <td>Bắt buộc</td>
              <td>
                <button className="action-btn">Chỉnh sửa</button>
                <button className="action-btn reject">Xóa</button>
              </td>
            </tr>

            <tr>
              <td>CS102</td>
              <td>Công nghệ phần mềm</td>
              <td>4</td>
              <td>Bắt buộc</td>
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