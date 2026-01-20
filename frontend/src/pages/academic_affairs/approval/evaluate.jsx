import "../dashboard.css";

export default function EvaluateSyllabus() {
  return (
    <div className="academic-affairs-dashboard">
      {/* TITLE */}
      <h1 className="page-title">Đánh giá đề cương</h1>

      {/* TABLE */}
      <div className="dashboard-section">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Môn học</th>
              <th>Người đánh giá</th>
              <th>Điểm đánh giá</th>
              <th>Nhận xét</th>
              <th>Ngày đánh giá</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Lập trình Web</td>
              <td>Nguyễn Văn A</td>
              <td>8/10</td>
              <td>Đề cương chi tiết, cần bổ sung ví dụ</td>
              <td>05/01/2026</td>
            </tr>

            <tr>
              <td>Công nghệ phần mềm</td>
              <td>Trần Thị B</td>
              <td>9/10</td>
              <td>Rất tốt, phù hợp với chương trình</td>
              <td>04/01/2026</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}