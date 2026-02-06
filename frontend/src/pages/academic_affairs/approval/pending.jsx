import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./pending.css";
import { getSyllabi, updateSyllabus } from "../syllabus";

const formatDate = (date) => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export default function PendingApprovals() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [rows, setRows] = useState(() =>
    getSyllabi().filter((item) => item.approvalStatus === "pending")
  );

  const handlePLOCheck = (item) => {
    navigate("/academic_affairs/approval/plo-check", { state: { syllabus: item } });
  };

  const handleApprove = (item) => {
    const approvedAt = formatDate(new Date());
    updateSyllabus(item.id, { approvalStatus: "approved", approvedAt });
    setRows(getSyllabi().filter((row) => row.approvalStatus === "pending"));

    // Hiển thị thông báo
    setNotification({
      type: "success",
      message: `Đã duyệt giáo trình "${item.subject}" của ${item.teacher}`
    });
    
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleReject = (item) => {
    const approvedAt = formatDate(new Date());
    updateSyllabus(item.id, { approvalStatus: "rejected", approvedAt });
    setRows(getSyllabi().filter((row) => row.approvalStatus === "pending"));

    // Hiển thị thông báo
    setNotification({
      type: "error",
      message: `Đã từ chối giáo trình "${item.subject}" của ${item.teacher}`
    });
    
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <div className="aaPending">
      {/* Notification Toast */}
      {notification && (
        <div className={`aaNotification aaNotification--${notification.type}`}
             style={{
               position: 'fixed',
               top: '20px',
               right: '20px',
               padding: '16px 24px',
               borderRadius: '8px',
               backgroundColor: notification.type === 'success' ? '#10b981' : '#ef4444',
               color: 'white',
               boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
               zIndex: 9999,
               animation: 'slideIn 0.3s ease-out'
             }}>
          {notification.message}
        </div>
      )}

      <h1 className="aaTitle">Giáo trình chờ duyệt</h1>

      <div className="aaCard">
        <div className="aaCardHeader">
          <div className="aaFilterGroup">
            <label>Tìm kiếm</label>
            <input className="aaInput" placeholder="Tìm theo tên môn học, mã môn, giảng viên" />
          </div>

          <div className="aaStats">
            <span className="aaBadge aaBadge--total">Tổng: {rows.length}</span>
          </div>
        </div>

        <table className="aaTable">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>STT</th>
              <th>Môn học</th>
              <th>Giảng viên</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th style={{ width: "140px" }}>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  <div className="aaCourseInfo">
                    <div className="aaCourseTitle">{item.subject}</div>
                  </div>
                </td>
                <td>{item.teacher}</td>
                <td>{item.submittedAt}</td>
                <td>
                  <span className="aaStatus aaStatus--pending">
                    Chờ duyệt
                  </span>
                </td>
                <td>
                  <div className="aaActionGroup">
                    <button 
                      className="aaActionBtn aaActionBtn--approve"
                      onClick={() => handleApprove(item)}
                    >
                      Duyệt
                    </button>
                    <button 
                      className="aaActionBtn aaActionBtn--reject"
                      onClick={() => handleReject(item)}
                    >
                      Từ chối
                    </button>
                    <button 
                      className="aaLink" 
                      onClick={() => handlePLOCheck(item)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Kiểm tra PLO
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}