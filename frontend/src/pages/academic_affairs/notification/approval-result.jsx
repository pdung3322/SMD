import "./approval-result.css";

export default function ApprovalResult() {
  return (
    <div className="aaNotification">
      {/* TITLE */}
      <h1 className="aaTitle">Thông báo kết quả duyệt giáo trình</h1>

      {/* TABLE */}
      <div className="aaCard">
        <div className="aaTableWrapper">
          <table className="aaTable">
            <thead>
              <tr>
                <th>Môn học</th>
                <th>Người tạo</th>
                <th>Kết quả</th>
                <th>Ngày duyệt</th>
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
                  <button className="aaLink">Gửi thông báo</button>
                </td>
              </tr>

              <tr>
                <td>Công nghệ phần mềm</td>
                <td>Trần Thị B</td>
                <td className="aaStatus aaStatus--rejected">Từ chối</td>
                <td>04/01/2026</td>
                <td style={{ textAlign: "right" }}>
                  <button className="aaLink">Gửi thông báo</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}