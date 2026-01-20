// src/pages/student/subscribe/notifications.jsx
import React, { useState } from 'react';

const StudentSubscribe = () => {
  const [status, setStatus] = useState('');

  const handleSubscribe = () => {
    // Mock subscribe logic
    setStatus('Đã theo dõi thành công! Sẽ nhận thông báo khi cập nhật.');
  };

  return (
    <div>
      <h2>Theo dõi và nhận thông báo</h2>
      <button onClick={handleSubscribe}>Theo dõi</button>
      <p>{status}</p>
    </div>
  );
};

export default StudentSubscribe;