import React, { useEffect, useState } from "react";
import "./AAReport.css";

const AAReport = () => {
  const [reports, setReports] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setReports([
        {
          id: 1,
          title: "Báo cáo tổng hợp học kỳ 1",
          period: "2024 - HK1",
          createdDate: "20/12/2024",
          total: 120,
          approved: 95,
          rejected: 10,
          pending: 15,
          note: "Cần cải thiện CLO-PLO mapping."
        },
        {
          id: 2,
          title: "Báo cáo tổng hợp học kỳ 2",
          period: "2024 - HK2",
          createdDate: "18/05/2025",
          total: 130,
          approved: 110,
          rejected: 8,
          pending: 12,
          note: "Các khoa kỹ thuật hoàn thành đúng hạn."
        }
      ]);
    }, 500);
  }, []);

  return (
    <div className="aa-simple-container">
      <h1>Báo cáo tổng hợp từ Academic Affairs</h1>

      <div className="report-list-simple">
        {reports.map((r) => (
          <div
            key={r.id}
            className={`report-row ${selectedId === r.id ? "active" : ""}`}
            onClick={() => setSelectedId(r.id)}
          >
            <div className="row-main">
              <strong>{r.title}</strong>
              <span>{r.period}</span>
              <small>{r.createdDate}</small>
            </div>

            {selectedId === r.id && (
              <div className="row-detail">
                <div className="stats">
                  <div>Tổng: <b>{r.total}</b></div>
                  <div>Đã duyệt: <b>{r.approved}</b></div>
                  <div>Từ chối: <b>{r.rejected}</b></div>
                  <div>Chờ xử lý: <b>{r.pending}</b></div>
                </div>
                <div className="note">
                  <b>Nhận xét AA:</b> {r.note}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AAReport;
