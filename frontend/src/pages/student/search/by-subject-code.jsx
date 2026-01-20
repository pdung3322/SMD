import React, { useState } from 'react';
import { coursesData } from './courses-data';
import './search-style.css';

const SearchByCode = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const searchResults = coursesData.filter(course =>
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="search-container">
      {/* Header */}
      <div className="search-header">
        <h1>Tìm kiếm đề cương học phần</h1>
      </div>

      {/* Search Content */}
      <div className="search-content">
        <h2>Tìm theo mã môn học</h2>

        {/* Search Input */}
        <div className="search-box-section">
          <input
            type="text"
            placeholder="Nhập mã môn học..."
            className="search-input-large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                      <div className="result-category">{course.category}</div>
                    </div>
                    <button className="result-menu-button">⋮</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>Không tìm thấy môn học nào phù hợp</p>
              <small>Vui lòng thử lại với từ khóa khác</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchByCode;