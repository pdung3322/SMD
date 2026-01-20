import "../dashboard.css";

export default function PloCheck() {
  return (
    <div className="academic-affairs-dashboard">
      {/* TITLE */}
      <h1 className="page-title">Kiểm tra sự phù hợp với PLO</h1>

      {/* TABLE */}
      <div className="dashboard-section">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Môn học</th>
              <th>CLO</th>
              <th>PLO liên kết</th>
              <th>Mức độ phù hợp</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Lập trình Web</td>
              <td>CLO1: Hiểu khái niệm lập trình</td>
              <td>PLO1: Kiến thức cơ bản</td>
              <td className="status approved">Phù hợp</td>
              <td>
                <button className="action-btn">Xem chi tiết</button>
              </td>
            </tr>

            <tr>
              <td>Công nghệ phần mềm</td>
              <td>CLO2: Áp dụng quy trình phát triển</td>
              <td>PLO2: Kỹ năng thực hành</td>
              <td className="status pending">Cần điều chỉnh</td>
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