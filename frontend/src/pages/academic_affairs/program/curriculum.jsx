import "./curriculum.css";
import { useRef, useState } from "react";
import { curriculumProgramsData } from "../../../mockData/academicAffairsMockData";

export default function Curriculum() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const scrollYRef = useRef(0);

  const openProgramModal = (program) => {
    // giữ vị trí hiện tại + khóa scroll nền (không bị giật / kéo trang)
    scrollYRef.current = window.scrollY || 0;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = "100%";
    setSelectedProgram(program);
  };

  const closeProgramModal = () => {
    // trả lại scroll y ban đầu
    const y = scrollYRef.current || 0;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, y);
    setSelectedProgram(null);
  };

  const programs = curriculumProgramsData;

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
              type="button"
              onClick={() => openProgramModal(program)}
            >
              Xem môn học →
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedProgram && (
        <>
          {/* Backdrop */}
          <div className="aaModalBackdrop" onClick={closeProgramModal} />

          {/* Modal */}
          <div className="aaModalContent aaModalContent--floating" role="dialog" aria-modal="true">
            <div className="aaModalHeader">
              <h2 className="aaModalTitle">{selectedProgram.name}</h2>
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
              <button className="aaModalBtn" onClick={closeProgramModal}>
                Đóng
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
