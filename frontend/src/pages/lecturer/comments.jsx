import { Card, Table, Tag } from "antd";
import "./comments.css";

const data = [
  {
    key: 1,
    syllabus: "Công nghệ phần mềm",
    version: "v2",
    commenter: "Hội đồng Khoa",
    content: "Bổ sung chuẩn đầu ra CLO",
    date: "2025-10-20",
  },
];

export default function LecturerComments() {
  return (
    <Card>
      <h2 className="page-title">Nhận xét</h2>

      <Table
        columns={[
          { title: "Giáo trình", dataIndex: "syllabus" },
          { title: "Phiên bản", dataIndex: "version" },
          { title: "Người nhận xét", dataIndex: "commenter" },
          { title: "Nội dung", dataIndex: "content" },
          { title: "Ngày", dataIndex: "date" },
        ]}
        dataSource={data}
      />
    </Card>
  );
}
