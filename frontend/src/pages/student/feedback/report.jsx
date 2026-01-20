import React, { useState } from 'react';
import './report.css'; // 👈 gắn đường dẫn CSS

const StudentFeedback = () => {
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = () => {
    if (!feedback.trim()) {
      setStatus('Vui lòng nhập nội dung phản hồi!');
      return;
    }

    // Mock gửi phản hồi
    setStatus('Phản hồi đã gửi thành công!');
    setFeedback('');
  };

  return (
    <div className="feedback-page"> {/* 👈 Thêm wrapper này để căn giữa và lề đều */}
      <div className="feedback-container">
        <h2>Gửi phản hồi và góp ý</h2>

        <textarea
          className="feedback-textarea"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Nhập phản hồi của bạn..."
        />

        <button className="feedback-btn" onClick={handleSubmit}>
          Gửi
        </button>

        {status && <p className="feedback-status">{status}</p>}
      </div>
    </div>
  );
};

export default StudentFeedback;