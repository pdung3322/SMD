import React, { useEffect, useState } from "react";
import "./KpiMonitoring.css";

/**
 * Component Theo dõi KPI hệ thống
 * Hiển thị các chỉ số đo lường hiệu suất của quy trình phê duyệt đề cương
 */
const KpiMonitoring = () => {
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập lấy dữ liệu từ API hệ thống SMD
    const fetchKPI = () => {
      setTimeout(() => {
        setKpi({
          totalSyllabus: 320,
          approved: 260,
          pending: 42,
          rejected: 18,
          avgApprovalTime: 4.6,
          overdue: 9,
        });
        setLoading(false);
      }, 800);
    };

    fetchKPI();
  }, []);

  if (loading) {
    return (
      <div className="kpi-loader-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu KPI hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="kpi-dashboard-wrapper">
      <header className="kpi-header">
        <h1 className="page-title">Bảng theo dõi KPI hệ thống</h1>
        <p className="kpi-subtitle">Dữ liệu tính đến ngày: {new Date().toLocaleDateString('vi-VN')}</p>
      </header>

      {/* Grid hiển thị các chỉ số chính */}
      <div className="kpi-metrics-grid">
        <KpiCard title="Tổng số đề cương" value={kpi.totalSyllabus} type="default" />
        <KpiCard title="Đã phê duyệt" value={kpi.approved} type="success" />
        <KpiCard title="Đang chờ xử lý" value={kpi.pending} type="warning" />
        <KpiCard title="Bị từ chối" value={kpi.rejected} type="danger" />
        <KpiCard title="Đề cương quá hạn" value={kpi.overdue} type="danger-alert" />
      </div>

      {/* Khối nhận định hệ thống */}
      <section className="kpi-insights-section">
        <h2>Nhận định nhanh từ hệ thống</h2>
        <div className="insights-content">
          <ul className="insights-list">
            <li className="insight-item green">
              Tỷ lệ phê duyệt đạt <strong>{((kpi.approved / kpi.totalSyllabus) * 100).toFixed(1)}%</strong>, ở mức ổn định.
            </li>
            <li className="insight-item orange">
              Phát hiện <strong>{kpi.overdue}</strong> đề cương đang xử lý vượt quá thời gian quy định (SLA).
            </li>
            <li className="insight-item red">
              Cần rà soát các khoa có tỷ lệ từ chối cao để hỗ trợ chuyên môn kịp thời.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

/**
 * Component con cho thẻ KPI
 */
const KpiCard = ({ title, value, type, unit = "" }) => (
  <div className={`kpi-stat-card ${type}`}>
    <div className="card-inner">
      <h3 className="card-label">{title}</h3>
      <div className="card-value-group">
        <span className="value-number">{value}</span>
        {unit && <span className="value-unit">{unit}</span>}
      </div>
    </div>
    <div className="card-decoration"></div>
  </div>
);

export default KpiMonitoring;