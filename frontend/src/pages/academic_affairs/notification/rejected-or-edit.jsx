import "./rejected-or-edit.css";

export default function RejectedOrEdit() {
  return (
    <div className="aaNotification">
      {/* TITLE */}
      <h1 className="aaTitle">Thông báo giáo trình yêu cầu chỉnh sửa</h1>

      {/* TABLE */}
      <div className="aaCard">
        <div className="aaTableWrapper">
          <table className="aaTable">
            <thead>
              <tr>
                <th>Môn học</th>
                <th>Người tạo</th>
                <th>Lý do</th>
                <th>Ngày từ chối</th>
                <th style={{ textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Lập trình Web</td>
                <td>Nguyễn Văn Chiến</td>
                <td>Thiếu thông tin PLO</td>
                <td>05/01/2026</td>
                <td style={{ textAlign: "right" }}>
                  <button className="aaLink">Gửi thông báo</button>
                </td>
              </tr>

              <tr>
                <td>Công nghệ phần mềm</td>
                <td>Trần Thị B</td>
                <td>Cần chỉnh sửa nội dung</td>
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