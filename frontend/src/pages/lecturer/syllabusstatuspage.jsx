import { Card, Table, Tag } from "antd";
import "./syllabusstatuspage.css";

export default function SyllabusStatusPage() {
  const dataSource = [
    {
      key: 1,
      syllabus: "Công nghệ phần mềm",
      version: "v1",
      status: "Đang duyệt",
    },
    {
      key: 2,
      syllabus: "Lập trình Web",
      version: "v2",
      status: "Đã phê duyệt",
    },
    {
      key: 3,
      syllabus: "Cơ sở dữ liệu",
      version: "v3",
      status: "Yêu cầu chỉnh sửa",
    },
  ];

  const columns = [
    {
      title: "Giáo trình",
      dataIndex: "syllabus",
      className: "col-syllabus",
    },
    {
      title: "Phiên bản",
      dataIndex: "version",
      width: 120,
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 180,
      align: "center",
      render: (s) => {
        let color = "default";
        if (s === "Đang duyệt") color = "orange";
        if (s === "Đã phê duyệt") color = "green";
        if (s === "Yêu cầu chỉnh sửa") color = "red";

        return <Tag color={color}>{s}</Tag>;
      },
    },
  ];

  return (
    <div className="syllabus-status-page">
      <Card className="status-card">
        <h2 className="page-title">Trạng thái giáo trình</h2>

        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          rowKey="key"
        />
      </Card>
    </div>
  );
}
