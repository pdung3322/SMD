import { useNavigate } from "react-router-dom";
import "./pending.css";

const sampleData = [
  {
    name: "Cơ Sở Dữ Liệu",
    teacher: "Lê Văn C",
    date: "03/01/2026",
    status: "pending_approval",
  },
  {
    name: "Lập Trình Web",
    teacher: "Trần Thị B",
    date: "02/01/2026",
    status: "pending_approval",
  },
  {
    name: "Toán Cao Cấp",
    teacher: "Nguyễn Văn A",
    date: "01/01/2026",
    status: "pending_approval",
  },
];

export default function PendingApprovals() {
  const navigate = useNavigate();

  const handlePLOCheck = (item) => {
    navigate("/academic_affairs/approval/plo-check", { state: { syllabus: item } });
  };

  return (
    <div className="aaPending">
      <h1 className="aaTitle">Giáo trình chờ duyệt</h1>

      <div className="aaCard">
        <div className="aaCardHeader">
          <div className="aaFilterGroup">
            <label>Tìm kiếm</label>
            <input className="aaInput" placeholder="Tìm theo tên môn học, mã môn, giảng viên" />
          </div>

          <div className="aaStats">
            <span className="aaBadge aaBadge--total">Tổng: 3</span>
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
            {sampleData.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  <div className="aaCourseInfo">
                    <div className="aaCourseTitle">{item.name}</div>
                  </div>
                </td>
                <td>{item.teacher}</td>
                <td>{item.date}</td>
                <td>
                  <span className="aaStatus aaStatus--pending">
                    Chờ duyệt
                  </span>
                </td>
                <td>
                  <div className="aaActionGroup">
                    <button className="aaActionBtn aaActionBtn--approve">Duyệt</button>
                    <button className="aaActionBtn aaActionBtn--reject">Từ chối</button>
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