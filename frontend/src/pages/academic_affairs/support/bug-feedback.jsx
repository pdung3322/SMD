import "../dashboard.css";

export default function BugFeedback() {
  return (
    <div className="academic-affairs-dashboard">
      {/* TITLE */}
      <h1 className="page-title">Báo lỗi và góp ý</h1>

      {/* FORM */}
      <div className="dashboard-section">
        <form>
          <div style={{ marginBottom: '16px', color: '#1f2937' }}>
            <label>Loại: </label>
            <select style={{ padding: '8px' }}>
              <option>Báo lỗi</option>
              <option>Góp ý</option>
            </select>
          </div>
          <div style={{ marginBottom: '16px', color: '#1f2937' }}>
            <label>Mô tả: </label>
            <textarea style={{ width: '100%', padding: '8px', height: '100px' }}></textarea>
          </div>
          <button className="action-btn approve" type="submit">Gửi</button>
        </form>
      </div>
    </div>
  );
}