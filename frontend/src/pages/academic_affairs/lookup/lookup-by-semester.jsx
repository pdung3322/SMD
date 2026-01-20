import "../dashboard.css";

export default function LookupBySemester() {
  return (
    <div className="academic-affairs-dashboard">
      {/* TITLE */}
      <h1 className="page-title">Tra cứu đề cương theo năm học và học kỳ</h1>

      {/* FILTERS */}
      <div className="dashboard-section">
        <div style={{ marginBottom: '16px', color: '#1f2937' }}>
          <label>Năm học: </label>
          <select>
            <option>2025-2026</option>
            <option>2024-2025</option>
          </select>
          <label style={{ marginLeft: '16px' }}>Học kỳ: </label>
          <select>
            <option>Học kỳ 1</option>
            <option>Học kỳ 2</option>
          </select>
          <button className="action-btn" style={{ marginLeft: '16px' }}>Tìm kiếm</button>
        </div>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Môn học</th>
              <th>Giảng viên</th>
              <th>Trạng thái</th>
              <th>Ngày cập nhật</th>
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
                <button className="action-btn">Xem chi tiết</button>
              </td>
            </tr>

            <tr>
              <td>Công nghệ phần mềm</td>
              <td>Trần Thị B</td>
              <td className="status approved">Đã duyệt</td>
              <td>04/01/2026</td>
              <td>
                <button className="action-btn">Xem chi tiết</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}