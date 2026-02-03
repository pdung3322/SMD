import React from "react";

const mockNotifications = [
  {
    id: 1,
    code: "[01040051050202]",
    name: "Triết học Mác - Lênin - 23-02",
    hasSyllabus: false, // chưa có đề cương
  },
  {
    id: 2,
    code: "[010400510610]",
    name: "Kinh tế chính trị Mác - Lênin - LLCT",
    hasSyllabus: true, // đã có đề cương
  },
  {
    id: 3,
    code: "[010408010302]",
    name: "Tư duy thiết kế và đổi mới sáng tạo - 7580205630390",
    hasSyllabus: true,
  },
  {
    id: 4,
    code: "[010412100204]",
    name: "Thiết kế cơ sở dữ liệu - 23-02",
    hasSyllabus: false,
  },
  {
    id: 5,
    code: "[010412100305]",
    name: "Hệ quản trị cơ sở dữ liệu - 23-02",
    hasSyllabus: false,
  },
  {
    id: 6,
    code: "[010412100801]",
    name: "Phân tích thiết kế hệ thống - 7460108039316",
    hasSyllabus: true,
  },
];

export default function Notify() {
  return (
    <div style={{ padding: 20 }}>
      <h2>🔔 Thông báo môn học</h2>

      {mockNotifications.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 10,
            background: "#fff",
          }}
        >
          <div style={{ fontWeight: "bold" }}>
            {item.code} {item.name}
          </div>

          <div
            style={{
              marginTop: 6,
              color: item.hasSyllabus ? "green" : "red",
            }}
          >
            {item.hasSyllabus
              ? `Môn ${item.name} đã có đề cương.`
              : `Môn ${item.name} chưa có đề cương.`}
          </div>
        </div>
      ))}
    </div>
  );
}