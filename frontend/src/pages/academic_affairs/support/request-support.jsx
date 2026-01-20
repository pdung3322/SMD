import "../dashboard.css";

export default function RequestSupport() {
  return (
    <div className="academic-affairs-dashboard">
      {/* TITLE */}
      <h1 className="page-title">Gửi yêu cầu hỗ trợ</h1>

      {/* FORM */}
      <div className="dashboard-section">
        <form>
          <div style={{ marginBottom: '16px', color: '#1f2937' }}>
            <label>Tiêu đề: </label>
            <input type="text" style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '16px', color: '#1f2937' }}>
            <label>Mô tả: </label>
            <textarea style={{ width: '100%', padding: '8px', height: '100px' }}></textarea>
          </div>
          <button className="action-btn approve" type="submit">Gửi yêu cầu</button>
        </form>
      </div>
    </div>
  );
}