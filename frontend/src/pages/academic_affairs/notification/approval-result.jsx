import "./approval-result.css";

const STATUS = {
  approved: { label: "Đã duyệt", tone: "approved" },
  rejected: { label: "Từ chối", tone: "rejected" },
};

const rows = [
  {
    id: "ap_001",
    subject: "Lập trình Web",
    creator: "Nguyễn Văn Chiến",
    result: "approved",
    approvedAt: "05/01/2026",
  },
  {
    id: "ap_002",
    subject: "Công nghệ phần mềm",
    creator: "Trần Thị B",
    result: "rejected",
    approvedAt: "04/01/2026",
  },
];

export default function ApprovalResult() {
  return (
    <div className="aaApprovalResult">
      <div className="aaHead">
        <h1 className="aaTitle">Thông báo kết quả duyệt giáo trình</h1>
        
      </div>

      <div className="aaCard">
        <div className="aaTableWrapper">
          <table className="aaTable">
            <thead>
              <tr>
                <th style={{ width: 60 }}>STT</th>
                <th>Môn học</th>
                <th>Người tạo</th>
                <th>Kết quả</th>
                <th>Ngày duyệt</th>
                <th style={{ width: 140, textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, index) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{index + 1}</td>
                  <td className="aaCourseName">{r.subject}</td>
                  <td>{r.creator}</td>
                  <td>
                    <span className={`aaBadge aaBadge--${STATUS[r.result].tone}`}>
                      {STATUS[r.result].label}
                    </span>
                  </td>
                  <td>{r.approvedAt}</td>
                  <td style={{ textAlign: "right" }}>
                    <button className="aaLinkBtn" type="button">
                      Gửi thông báo
                    </button>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="aaEmpty">
                    <div className="aaEmptyTitle">Chưa có thông báo</div>
                    <div className="aaEmptySub">Khi có kết quả duyệt, hệ thống sẽ hiển thị tại đây.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

       
      </div>
    </div>
  );
}
