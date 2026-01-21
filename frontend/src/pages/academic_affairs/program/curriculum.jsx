import "./curriculum.css";
import { useState } from "react";

export default function Curriculum() {
  const [selectedProgram, setSelectedProgram] = useState(null);

  const programs = [
    {
      id: 1,
      name: "Công Nghệ Thông Tin",
      code: "CNTT",
      courses: [
        "Lập trình Web",
        "Cơ sở dữ liệu",
        "Công nghệ phần mềm",
        "Mạng máy tính",
      ],
    },
    {
      id: 2,
      name: "Kế Toán - Tài Chính",
      code: "KT",
      courses: [
        "Kế toán tài chính",
        "Luật thuế",
        "Kiểm toán",
        "Phân tích tài chính",
      ],
    },
    {
      id: 3,
      name: "Quản Lý Kinh Doanh",
      code: "QLKD",
      courses: [
        "Chiến lược kinh doanh",
        "Quản lý nhân sự",
        "Quản lý tài chính",
        "Tiếp thị",
      ],
    },
    {
      id: 4,
      name: "Luật Học ",
      code: "L",
      courses: [
        "Luật hình sự",
        "Luật dân sự",
        "Luật thương mại",
        "Luật lao động",
      ],
    },
    {
      id: 5,
      name: "Sư Phạm - Giáo Dục",
      code: "GD",
      courses: [
        "Phương pháp giảng dạy",
        "Tâm lý giáo dục",
        "Quản lý lớp học",
        "Đánh giá học tập",
      ],
    },
    {
      id: 6,
      name: "Y Học - Điều Dưỡng",
      code: "YT",
      courses: [
        "Giải phẫu học",
        "Sinh lý học",
        "Bệnh học",
        "Kỹ năng điều dưỡng",
      ],
    },
    {
      id: 7,
      name: "Kỹ Thuật Xây Dựng",
      code: "KT",
      courses: [
        "Thiết kế kết cấu",
        "Vật liệu xây dựng",
        "Quản lý công trình",
        "An toàn lao động",
      ],
    },
  ];

  return (
    <div className="aaCurriculum">
      <h1 className="aaTitle">Quản Lý Chương Trình Đào Tạo</h1>

      <div className="aaProgramList">
        {programs.map((program) => (
          <div key={program.id} className="aaProgramItem">
            <div className="aaProgramItemContent">
              <h3 className="aaProgramItemName">{program.name}</h3>
            </div>
            <button
              className="aaProgramItemBtn"
              onClick={() => setSelectedProgram(program)}
            >
              Xem môn học →
            </button>
          </div>
        ))}
      </div>

      {/* MODAL/POPUP */}
      {selectedProgram && (
        <div className="aaModal">
          <div className="aaModalOverlay" onClick={() => setSelectedProgram(null)}></div>
          <div className="aaModalContent">
            <div className="aaModalHeader">
              <h2 className="aaModalTitle">
                {selectedProgram.name}
              </h2>
              <button
                className="aaModalClose"
                onClick={() => setSelectedProgram(null)}
              >
                ✕
              </button>
            </div>

            <div className="aaModalBody">
              <p className="aaCoursesTitle">Danh sách các môn học:</p>
              <ul className="aaCoursesList">
                {selectedProgram.courses.map((course, idx) => (
                  <li key={idx} className="aaCourseItem">
                    {course}
                  </li>
                ))}
              </ul>
            </div>

            <div className="aaModalFooter">
              <button
                className="aaModalBtn"
                onClick={() => setSelectedProgram(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
