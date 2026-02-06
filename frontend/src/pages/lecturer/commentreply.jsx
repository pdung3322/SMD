import { useState } from "react";
import { Card, Input, Button, Avatar, Divider } from "antd";
import "./commentreply.css";

const { TextArea } = Input;

/* ===== MOCK THREAD ===== */
const initialReplies = [
  {
    id: 1,
    author: "Trưởng bộ môn",
    role: "HOD",
    content: "Cần bổ sung chuẩn đầu ra CLO cho chương 3.",
    time: "2026-01-14 09:30",
  },
  {
    id: 2,
    author: "Nguyễn Văn Chiến",
    role: "LECTURER",
    content: "Dạ em đã bổ sung CLO 3.2 và 3.3 theo góp ý.",
    time: "2026-01-14 14:10",
  },
  {
    id: 3,
    author: "Trưởng bộ môn",
    role: "HOD",
    content: "Ok, phần CLO đã rõ ràng hơn.",
    time: "2026-01-15 08:45",
  },
];

export default function LecturerCommentReply() {
  const [replies, setReplies] = useState(initialReplies);
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    const newReply = {
      id: Date.now(),
      author: "Nguyễn Văn Chiến",
      role: "LECTURER",
      content: text,
      time: new Date().toLocaleString(),
    };

    setReplies([...replies, newReply]);
    setText("");
  };

  return (
    <Card className="comment-reply-page">
      <h2 className="page-title">Phản hồi nhận xét</h2>

      <p className="comment-topic">
        <b>Nhận xét:</b> Bổ sung chuẩn đầu ra CLO
      </p>

      <Divider />

      {/* ===== THREAD ===== */}
      <div className="reply-thread">
        {replies.map((r) => (
          <div
            key={r.id}
            className={`reply-item ${
              r.role === "LECTURER" ? "me" : "other"
            }`}
          >
            <Avatar className="avatar">
              {r.author.charAt(0)}
            </Avatar>

            <div className="reply-content">
              <div className="reply-header">
                <span className="author">{r.author}</span>
                <span className="time">{r.time}</span>
              </div>
              <div className="reply-text">{r.content}</div>
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* ===== INPUT ===== */}
      <TextArea
        rows={4}
        placeholder="Nhập phản hồi..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="reply-actions">
        <Button type="primary" onClick={handleSend}>
          Gửi phản hồi
        </Button>
      </div>
    </Card>
  );
}
