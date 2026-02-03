import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './course_overview.css';

const CourseOverview = () => {
  // Sample course data
  const courses = [
    {
      id: 1,
      code: '[01040051050202]',
      name: 'Triết học Mác - Lênin - 23-02',
      category: '[CLC]_HKI2024-2025_Khóa Lý luận chính trị',
      major: 'Lý luận chính trị',
      semester: 'HKI 2024-2025',
      completion: 0,
      color: '#7DD3C0'
    },
    {
      id: 2,
      code: '[010400510610]',
      name: 'Kinh tế chính trị Mác - Lênin - LLCT',
      category: '[CLC]_HKI2025-2026_Khóa Lý luận chính trị',
      major: 'Lý luận chính trị',
      semester: 'HKI 2025-2026',
      completion: 50,
      color: '#E57373'
    },
    {
      id: 3,
      code: '[010408010302]',
      name: 'Tư duy thiết kế và đổi mới sáng tạo - 7580205630390',
      category: '[CLC]_HKI2025-2026_Phòng Đào tạo',
      major: 'Đại cương',
      semester: 'HKI 2025-2026',
      completion: 35,
      color: '#81D4FA'
    },
    {
      id: 4,
      code: '[010412100204]',
      name: 'Thiết kế cơ sở dữ liệu - 23-02',
      category: '[CLC]_HKI2024-2025_Khóa Công nghệ thông tin',
      major: 'Công nghệ thông tin',
      semester: 'HKI 2024-2025',
      completion: 0,
      color: '#BA68C8'
    },
    {
      id: 5,
      code: '[010412100305]',
      name: 'Hệ quản trị cơ sở dữ liệu - 23-02',
      category: '[CLC]_HKI2024-2025_Khóa Công nghệ thông tin',
      major: 'Công nghệ thông tin',
      semester: 'HKI 2024-2025',
      completion: 0,
      color: '#F06292'
    },
    {
      id: 6,
      code: '[010412100801]',
      name: 'Phân tích thiết kế hệ thống - 7460108039316',
      category: '[CLC]_HKI2024-2025_Viên Công nghệ thông tin và Điện, điện tử',
      major: 'Công nghệ thông tin',
      semester: 'HKI 2024-2025',
      completion: 0,
      color: '#64B5F6'
    }
  ];

  // 🔎 State cho search
  const [filterType, setFilterType] = useState("all");
  const [keyword, setKeyword] = useState("");

  // 🎯 Lọc danh sách
  const filteredCourses = courses.filter((course) => {
    const kw = keyword.toLowerCase();

    if (filterType === "monhoc") {
      return course.name.toLowerCase().includes(kw);
    }

    if (filterType === "mamon") {
      return course.code.toLowerCase().includes(kw);
    }

    if (filterType === "nganhhocki") {
      return (
        course.major.toLowerCase().includes(kw) ||
        course.semester.toLowerCase().includes(kw)
      );
    }

    // all
    return (
      course.name.toLowerCase().includes(kw) ||
      course.code.toLowerCase().includes(kw) ||
      course.category.toLowerCase().includes(kw)
    );
  });

  return (
    <div className="course-overview">
      {/* Header */}
      <div className="overview-header">
        <h1>Chào bạn, Nguyễn Thị Kim Ngọc! 👋</h1>
      </div>

      {/* Toolbar */}
      <div className="overview-toolbar">
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="monhoc">Tìm theo môn học</option>
          <option value="mamon">Tìm theo mã môn</option>
          <option value="nganhhocki">Tìm theo ngành và học kì</option>
        </select>

        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {/* Content Section */}
      <div className="overview-content">
        <h2>Tổng quan về khóa học</h2>

        {/* Course Cards */}
        <div className="courses-container">
          {filteredCourses.length === 0 && <p>Không tìm thấy môn học nào.</p>}

          {filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <div
                className="course-thumbnail"
                style={{ backgroundColor: course.color }}
              ></div>

              <div className="course-info">
                <div className="course-header-info">
                  <div className="course-titles">
                    <div className="course-code">{course.code}</div>
                    <div className="course-name">{course.name}</div>
                    <div className="course-category">{course.category}</div>
                  </div>
                  <button className="menu-button">
                    <span>⋮</span>
                  </button>
                </div>

                {course.completion > 0 && (
                  <div className="course-progress">
                    <div className="progress-percentage">{course.completion}% complete</div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${course.completion}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
