import "../dashboard.css";

export default function CompareSyllabus() {
  return (
    <div className="academic-affairs-dashboard">
      {/* TITLE */}
      <h1 className="page-title">So sánh đề cương giữa các học kỳ</h1>

      {/* COMPARISON */}
      <div className="dashboard-section">
        <div style={{ marginBottom: '16px', color: '#1f2937' }}>
          <label>Chọn đề cương 1: </label>
          <select>
            <option>Lập trình Web - Học kỳ 1 2025</option>
          </select>
          <label style={{ marginLeft: '16px' }}>Chọn đề cương 2: </label>
          <select>
            <option>Lập trình Web - Học kỳ 1 2024</option>
          </select>
          <button className="action-btn" style={{ marginLeft: '16px' }}>So sánh</button>
        </div>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Phần</th>
              <th>Đề cương 1</th>
              <th>Đề cương 2</th>
              <th>Sự khác biệt</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Mục tiêu học tập</td>
              <td>Hiểu khái niệm cơ bản</td>
              <td>Hiểu khái niệm và áp dụng</td>
              <td>Thêm "áp dụng"</td>
            </tr>

            <tr>
              <td>Nội dung</td>
              <td>5 chương</td>
              <td>6 chương</td>
              <td>Thêm 1 chương</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}