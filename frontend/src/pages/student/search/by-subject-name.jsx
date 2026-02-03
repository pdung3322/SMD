import { useState } from "react";
import { coursesData } from "./courses-data";
import "./search-style.css";

export default function BySubjectName() {
  const [keyword, setKeyword] = useState("");

  const filteredCourses = coursesData.filter((course) =>
    course.name.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Nhập tên môn học..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
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
