import { useState } from "react";
import { coursesData } from "./courses-data";
import "./search-style.css";

export default function ByMajorSemester() {
  const [major, setMajor] = useState("");
  const [semester, setSemester] = useState("");

  const filteredCourses = coursesData.filter((course) => {
    const matchMajor = course.major.toLowerCase().includes(major.toLowerCase());
    const matchSemester = course.semester.toLowerCase().includes(semester.toLowerCase());
    return matchMajor && matchSemester;
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Nhập ngành..."
        value={major}
        onChange={(e) => setMajor(e.target.value)}
        className="search-input"
      />

      <input
        type="text"
        placeholder="Nhập học kỳ..."
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
        className="search-input"
      />

      <div className="course-list">
        {filteredCourses.length === 0 && <p>Không tìm thấy môn học.</p>}

        {filteredCourses.map((course) => (
          <div key={course.id} className="course-card">
            <h3>{course.name}</h3>
            <p>Mã: {course.code}</p>
            <p>Ngành: {course.major}</p>
            <p>Học kỳ: {course.semester}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
