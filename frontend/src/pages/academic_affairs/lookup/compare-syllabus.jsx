import "./compare-syllabus.css";

export default function CompareSyllabus() {
  return (
    <div className="aaCompare">
      {/* TITLE */}
      <h1 className="aaTitle">So sánh giáo trình giữa các học kỳ</h1>

      {/* COMPARISON */}
      <div className="aaCard">
        <div className="aaCardHeader" style={{ gap: "16px" }}>
          <div className="aaFilterGroup">
            <label>Chọn giáo trình 1</label>
            <select className="aaSelect">
              <option>Lập trình Web - Học kỳ 1 2025</option>
            </select>
          </div>

          <div className="aaFilterGroup">
            <label>Chọn giáo trình 2</label>
            <select className="aaSelect">
              <option>Lập trình Web - Học kỳ 1 2024</option>
            </select>
          </div>

          <button className="aaBtn aaBtn--primary" style={{ marginTop: "22px" }}>
            So sánh
          </button>
        </div>

        <div className="aaTableWrapper">
          <table className="aaTable">
            <thead>
              <tr>
                <th>Phần</th>
                <th>Giáo trình 1</th>
                <th>Giáo trình 2</th>
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
    </div>
  );
}