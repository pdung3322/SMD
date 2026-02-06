import React, { useState } from 'react';
import './ApprovedSyllabus.css';

const ApprovedSyllabus = () => {
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);

  // Dữ liệu mẫu (Mock data)
  const approvedData = [
    { id: 1, name: "CNPM - Công nghệ phần mềm", code: "IT0010940248", dept: "CNTT", creator: "Nguyễn Minh Quân", date: "20/12/2025", status: "Đã phê duyệt" },
    { id: 2, name: "TMDT - Thương mại điện tử", code: "IT0053853839", dept: "CNTT", creator: "Nguyễn Quỳnh Anh", date: "15/12/2025", status: "Đã phê duyệt" },
  ];
  const handleApprove = (item) => {
    console.log("Duyệt giáo trình:", item);
    alert(`Đã duyệt giáo trình: ${item.name}`);
  };

  const handleReject = (item) => {
    console.log("Từ chối giáo trình:", item);
    alert(`Đã từ chối giáo trình: ${item.name}`);
  };
  return (
    <div className="smd-container">
      {/* 3. Tiêu đề và điều hướng */}
      <h2 className="page-title">Giáo trình đã phê duyệt</h2>

      {/* 4. Khu vực lọc và tìm kiếm */}
      <section className="filter-section">
        <div className="filter-grid">
          <select className="form-control"><option>Năm học 2025-2026</option></select>
          <select className="form-control"><option>Khoa Công nghệ thông tin</option></select>
          <input type="text" className="form-control" placeholder="Tên hoặc mã môn học..." />
          <div className="button-group">
            <button className="btn btn-primary">Tìm kiếm</button>
            <button className="btn btn-outline">Đặt lại</button>
          </div>
        </div>
      </section>

      {/* 5. Bảng danh sách đề cương */}
      <section className="table-section">
        <table className="data-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên môn học</th>
              <th>Mã môn</th>
              <th>Khoa</th>
              <th>Người tạo</th>
              <th>Ngày phê duyệt</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {approvedData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td><strong>{item.name}</strong></td>
                <td>{item.code}</td>
                <td>{item.dept}</td>
                <td>{item.creator}</td>
                <td>{item.date}</td>
                <td><span className="badge status-approved">{item.status}</span></td>
                <td>
                  <button className="btn-icon" onClick={() => setSelectedSyllabus(item)}>
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 6. Khu vực xem chi tiết (Modal hoặc Side Panel) */}
      {selectedSyllabus && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Chi tiết đề cương: {selectedSyllabus.name}</h3>
              <button className="close-btn" onClick={() => setSelectedSyllabus(null)}>&times;</button>
            </div>

            <div className="modal-body">
              {/* 6.1 Thông quan tổng quan */}
              <div className="info-grid">
                <div><p><strong>Mã môn:</strong> {selectedSyllabus.code}</p></div>
                <div><p><strong>Số tín chỉ:</strong> 3</p></div>
                <div><p><strong>Phiên bản:</strong> {selectedSyllabus.version}</p></div>
              </div>

              {/* 6.2 Dòng thời gian phê duyệt */}
              <div className="timeline">
                <h4>Lịch sử phê duyệt</h4>
                <div className="timeline-item completed">Gửi duyệt (Giảng viên)</div>
                <div className="timeline-item completed">Duyệt cấp HoD (Trưởng bộ môn)</div>
                <div className="timeline-item completed">Duyệt cấp AA (Phòng đào tạo)</div>
                <div className="timeline-item active">Phê duyệt cuối cùng (Hiệu trưởng)</div>
              </div>

              {/* 6.3 Nội dung Read-only */}
              <div className="content-preview">
                <h4>Nội dung học thuật</h4>
                <div className="readonly-box">
                  <p><strong>Mục tiêu:</strong> Cung cấp kiến thức nền tảng về phát triển ứng dụng...</p>
                  <p><strong>Chuẩn đầu ra (CLO):</strong> CLO1, CLO2, CLO3...</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedSyllabus(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedSyllabus;