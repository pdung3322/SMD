import "./lookup-by-semester.css";

export default function LookupBySemester() {
  return (
    <div className="aaLookup">
      {/* TITLE */}
      <h1 className="aaTitle">Tra cứu giáo trình theo năm học và học kỳ</h1>

      {/* CARD */}
      <div className="aaCard">
        {/* FILTERS */}
        <div className="aaCardHeader" style={{ gap: "16px" }}>
          <div className="aaFilterGroup">
            <label>Năm học</label>
            <select className="aaSelect">
              <option>2025-2026</option>
              <option>2024-2025</option>
            </select>
          </div>

          <div className="aaFilterGroup">
            <label>Học kỳ</label>
            <select className="aaSelect">
              <option>Học kỳ 1</option>
              <option>Học kỳ 2</option>
            </select>
          </div>

          <button className="aaBtn aaBtn--primary" style={{ marginTop: "22px" }}>
            Tìm kiếm
          </button>
        </div>

        {/* TABLE */}
        <div className="aaTableWrapper">
          <table className="aaTable">
            <thead>
              <tr>
                <th>Môn học</th>
                <th>Giảng viên</th>
                <th>Trạng thái</th>
                <th>Ngày cập nhật</th>
                <th style={{ textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Lập trình Web</td>
                <td>Nguyễn Văn Chiến</td>
                <td className="aaStatus aaStatus--approved">Đã duyệt</td>
                <td>05/01/2026</td>
                <td style={{ textAlign: "right" }}>
                  <button className="aaLink">Xem chi tiết</button>
                </td>
              </tr>

              <tr>
                <td>Công nghệ phần mềm</td>
                <td>Trần Thị B</td>
                <td className="aaStatus aaStatus--approved">Đã duyệt</td>
                <td>04/01/2026</td>
                <td style={{ textAlign: "right" }}>
                  <button className="aaLink">Xem chi tiết</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}