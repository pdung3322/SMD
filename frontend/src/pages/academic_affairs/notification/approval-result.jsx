import { useState } from "react";
import "./approval-result.css";
import { getSyllabi } from "../syllabus";

const STATUS = {
  approved: { label: "Đã duyệt", tone: "approved" },
  rejected: { label: "Từ chối", tone: "rejected" },
};

export default function ApprovalResult() {
  const rows = getSyllabi().filter(
    (row) => row.approvalStatus === "approved" || row.approvalStatus === "rejected"
  );
  const [sentNotifications, setSentNotifications] = useState([]);
  const [notification, setNotification] = useState(null);

  const handleSendNotification = (row) => {
    // Thêm vào danh sách đã gửi
    setSentNotifications([...sentNotifications, row.id]);
    
    // Hiển thị thông báo
    setNotification(`Đã gửi thông báo đến ${row.teacher} về môn ${row.subject}`);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <div className="aaApprovalResult">
      {/* Notification Toast */}
      {notification && (
        <div className="aaNotification"
             style={{
               position: 'fixed',
               top: '20px',
               right: '20px',
               padding: '16px 24px',
               borderRadius: '8px',
               backgroundColor: '#10b981',
               color: 'white',
               boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
               zIndex: 9999,
               animation: 'slideIn 0.3s ease-out'
             }}>
          {notification}
        </div>
      )}

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
                  <td>{r.teacher}</td>
                  <td>
                    <span className={`aaBadge aaBadge--${STATUS[r.approvalStatus].tone}`}>
                      {STATUS[r.approvalStatus].label}
                    </span>
                  </td>
                  <td>{r.approvedAt || r.submittedAt}</td>
                  <td style={{ textAlign: "right" }}>
                    {sentNotifications.includes(r.id) ? (
                      <span style={{ color: '#10b981', fontWeight: 500 }}>✓ Đã gửi</span>
                    ) : (
                      <button 
                        className="aaLinkBtn" 
                        type="button"
                        onClick={() => handleSendNotification(r)}
                      >
                        Gửi thông báo
                      </button>
                    )}
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
