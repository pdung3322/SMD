import React, { useState, useMemo } from 'react';
import { coursesData } from './courses-data';
import './search-style.css';

const SearchByMajorSemester = () => {
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  // Get unique majors and semesters from data
  const majors = useMemo(() => 
    [...new Set(coursesData.map(c => c.major))].sort(),
    []
  );

  const semesters = useMemo(() => 
    [...new Set(coursesData.map(c => c.semester))].sort(),
    []
  );

  // Filter results based on selected major and semester
  const searchResults = coursesData.filter(course => {
    const majorMatch = !selectedMajor || course.major === selectedMajor;
    const semesterMatch = !selectedSemester || course.semester === selectedSemester;
    return majorMatch && semesterMatch;
  });

  return (
    <div className="search-container">
      {/* Header */}
      <div className="search-header">
        <h1>Tìm kiếm đề cương học phần</h1>
      </div>

      {/* Search Content */}
      <div className="search-content">
        <h2>Tìm theo ngành và học kỳ</h2>

        {/* Filter Controls */}
        <div className="filter-controls">
          <div className="filter-group">
            <label>Ngành học</label>
            <select 
              className="filter-select"
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
            >
              <option value="">-- Tất cả ngành --</option>
              {majors.map(major => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Học kỳ</label>
            <select 
              className="filter-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">-- Tất cả học kỳ --</option>
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          Tìm thấy <strong>{searchResults.length}</strong> kết quả
        </div>

        {/* Search Results */}
        <div className="search-results">
          {searchResults.length > 0 ? (
            searchResults.map(course => (
              <div key={course.id} className="search-result-card">
                <div 
                  className="result-thumbnail"
                  style={{ backgroundColor: course.color }}
                ></div>
                
                <div className="result-info">
                  <div className="result-header">
                    <div className="result-titles">
                      <div className="result-code">{course.code}</div>
                      <div className="result-name">{course.name}</div>
                      <div className="result-meta">
                        <span className="badge">{course.major}</span>
                        <span className="badge">{course.semester}</span>
                      </div>
                    </div>
                    <button className="result-menu-button">⋮</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>Không tìm thấy môn học nào phù hợp</p>
              <small>Vui lòng thử chọn ngành hoặc học kỳ khác</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchByMajorSemester;