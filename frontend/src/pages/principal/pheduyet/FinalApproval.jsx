import React, { useState } from 'react';
import {
  Search, Filter, Calendar, ChevronRight,
  FileText, CheckCircle, AlertCircle, Info
} from 'lucide-react';
import './FinalApproval.css';

const MOCK_DATA = [
  { id: 1, name: 'MMT - Mạng Máy Tính', dept: 'Viện Công nghệ thông tin và Điện, điện tử', year: '2025-2026', status: 'pending', creator: 'Nguyễn Văn Chiến', aaNote: 'Nội dung đạt chuẩn ABET, đề xuất phê duyệt.' },
  { id: 2, name: 'WEB - Lập Trình Web', dept: 'Viện Công nghệ thông tin và Điện, điện tử', year: '2025-2026', status: 'pending', creator: 'Trần Thị Thảo', aaNote: 'Cần làm rõ phần thực hành chương 4.' },
  { id: 3, name: 'PPNC - Phương Pháp Nghiên Cứu', dept: 'Phòng Đào tạo', year: '2024-2025', status: 'approved', creator: 'Lê Văn Toàn', aaNote: '' },
];

const FinalApproval = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterDept, setFilterDept] = useState('all');

  return (
    <div className="approval-page">
      {/* Header section với Breadcrumb */}
      <header className="page-header">
        <div className="header-title">
          <h1>Giáo trình đang chờ phê duyệt</h1>
        </div>
      </header>

      {/* Bộ lọc Filter Bar */}
      <section className="filter-bar">
        <div className="filter-group">
          <div className="input-with-icon">
            <Search size={18} />
            <input type="text" placeholder="Tìm tên giáo trình..." />
          </div>

          <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
            <option value="all">Tất cả Khoa</option>
            <option value="CNTT">Khoa CNTT</option>
            <option value="DienTu">Khoa Điện tử</option>
          </select>

          <select>
            <option value="2025">Năm học 2025-2026</option>
            <option value="2024">Năm học 2024-2025</option>
          </select>
        </div>
      </section>

      <div className="main-layout">
        {/* Bảng danh sách - Table Section */}
        <section className={`table-card ${selectedItem ? 'is-split' : ''}`}>
          <table className="approval-table">
            <thead>
              <tr>
                <th>Tên giáo trình</th>
                <th>Khoa/Viện</th>
                <th>Năm học</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DATA.map(item => (
                <tr
                  key={item.id}
                  className={selectedItem?.id === item.id ? 'active-row' : ''}
                  onClick={() => setSelectedItem(item)}
                >
                  <td>
                    <div className="item-name">
                      <FileText size={16} className="icon-doc" />
                      <strong>{item.name}</strong>
                    </div>
                  </td>
                  <td><span className="badge-dept">{item.dept}</span></td>
                  <td>{item.year}</td>
                  <td className="action-cell">
                    <div className="table-actions">
                      <button
                        className="btn-approve-small"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Duyệt:', item.id);
                        }}
                      >
                        <CheckCircle size={14} /> Duyệt
                      </button>

                      <button
                        className="btn-reject-small"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Từ chối:', item.id);
                        }}
                      >
                        <AlertCircle size={14} /> Từ chối
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Side Panel Chi tiết - Detail Section */}
        {selectedItem && (
          <aside className="quick-view-panel">
            <div className="panel-header">
              <h3>Thông tin thẩm định</h3>
              <button className="close-btn" onClick={() => setSelectedItem(null)}>×</button>
            </div>

            <div className="panel-content">
              <div className="info-box">
                <label>Giảng viên soạn thảo</label>
                <p>{selectedItem.creator}</p>
              </div>

              <div className="aa-recommendation">
                <div className="rec-title">
                  <Info size={16} /> Đề xuất từ Phòng Đào tạo (AA)
                </div>
                <p className="rec-text">{selectedItem.aaNote}</p>
              </div>

              <div className="panel-actions-fixed">
                <button className="btn-main-approve">
                  <CheckCircle size={18} /> Phê duyệt cuối cùng
                </button>
                <button className="btn-main-reject">
                  <AlertCircle size={18} /> Từ chối đề cương
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default FinalApproval;