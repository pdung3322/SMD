// src/pages/student/dashboard.jsx
import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { coursesData } from '../search/courses-data';
import './dashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearchByCode = (value) => {
    setSearchQuery(value);
    
    if (value.trim() === '') {
      setFilteredCourses([]);
      setShowResults(false);
    } else {
      const results = coursesData.filter(course =>
        course.code.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCourses(results);
      setShowResults(true);
    }
  };

  const handleCourseSelect = (course) => {
    console.log('Selected course:', course);
    // Có thể thêm logic để xử lý khi click vào môn học
  };

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
      </div>

      <div className="search-section">
        <div className="search-section-header">
          <h2>Tìm Kiếm Mã Môn</h2>
          <button 
            className="btn-advanced-search"
            onClick={() => navigate('/student/search')}
          >
            🔍 Tìm Kiếm
          </button>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Nhập mã môn học (ví dụ: 010412100901)..."
            value={searchQuery}
            onChange={(e) => handleSearchByCode(e.target.value)}
            className="search-input"
          />
        </div>

        {showResults && (
          <div className="search-results">
            {filteredCourses.length > 0 ? (
              <div className="courses-list">
                <h3>Kết quả tìm kiếm ({filteredCourses.length})</h3>
                <div className="courses-grid">
                  {filteredCourses.map(course => (
                    <div
                      key={course.id}
                      className="course-card"
                      style={{ borderLeftColor: course.color }}
                      onClick={() => handleCourseSelect(course)}
                    >
                      <div className="course-code">{course.code}</div>
                      <div className="course-name">{course.name}</div>
                      <div className="course-info">
                        <span className="major">{course.major}</span>
                        <span className="semester">{course.semester}</span>
                      </div>
                      <div className="course-completion">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${course.completion}%`,
                              backgroundColor: course.color
                            }}
                          ></div>
                        </div>
                        <span className="completion-text">{course.completion}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-results">
                Không tìm thấy môn học nào với mã: "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      <div className="overview-section">
        <h2>Tổng Quan Môn Học</h2>
        <Outlet />
      </div>
    </div>
  );
};

export default StudentDashboard;