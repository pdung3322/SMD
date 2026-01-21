import "./dashboard.css";
import { useNavigate } from "react-router-dom";

export default function AcademicAffairsDashboard() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Duyệt Giáo Trình",
      description: "Xem danh sách giáo trình chờ duyệt",
      icon: "📋",
      path: "/academic-affairs/approval/pending",
    },
    {
      title: "Tra Cứu Giáo Trình",
      description: "Tra cứu theo năm học, học kỳ hoặc so sánh",
      icon: "🔍",
      path: "/academic-affairs/lookup/lookup-by-semester",
    },
    {
      title: "Quản Lý Chương Trình Đào Tạo",
      description: "Xem danh sách các ngành và môn học",
      icon: "📚",
      path: "/academic-affairs/program/curriculum",
    },
    {
      title: "Thông Báo",
      description: "Xem kết quả duyệt và yêu cầu chỉnh sửa",
      icon: "📬",
      path: "/academic-affairs/notification/approval-result",
    },
  ];

  return (
    <div className="aaDashboard">
      <h1 className="aaTitle">Bảng Điều Khiển Phòng Đào Tạo</h1>

      <div className="aaMenuGrid">
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            className="aaMenuCard"
            onClick={() => navigate(item.path)}
          >
            <div className="aaMenuIcon">{item.icon}</div>
            <h3 className="aaMenuTitle">{item.title}</h3>
            <p className="aaMenuDesc">{item.description}</p>
            <div className="aaMenuArrow">→</div>
          </div>
        ))}
      </div>
    </div>
  );
}