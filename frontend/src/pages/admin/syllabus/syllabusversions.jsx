import { Card, Table, Tag, Select, Space, Button } from "antd";
import "./syllabusversions.css";

const { Option } = Select;


const mockData = [
  {
    key: 1,
    course_code: "CNPM",
    course_name: "Công nghệ phần mềm",
    faculty: "Viện CNTT",
    semester: "HK1 2025–2026",
    version: "v2",
    created_by: "Nguyễn Văn A",
    created_at: "2026-01-10",
    status: "submitted",
    files: 3,
  },
  {
    key: 2,
    course_code: "WEB",
    course_name: "Lập trình Web",
    faculty: "Viện CNTT",
    semester: "HK1 2025–2026",
    version: "v1",
    created_by: "Trần Thị B",
    created_at: "2026-01-05",
    status: "approved",
    files: 2,
  },
];

const statusColor = {
  draft: "default",
  submitted: "orange",
  approved: "green",
  rejected: "red",
};

export default function SyllabusVersions() {
  const columns = [
    {
      title: "Môn học",
      render: r => (
        <>
          <div className="course-name">{r.course_name}</div>
          <div className="course-code">{r.course_code}</div>
        </>
      ),
    },
    {
      title: "Khoa",
      dataIndex: "faculty",
    },
    {
      title: "Học kỳ",
      dataIndex: "semester",
    },
    {
      title: "Phiên bản",
      dataIndex: "version",
    },
    {
      title: "Người tạo",
      dataIndex: "created_by",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
    },
    {
      title: "File",
      dataIndex: "files",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: s => (
        <Tag color={statusColor[s]}>
          {s.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      render: () => (
        <Button type="link">Xem chi tiết</Button>
      ),
    },
  ];

  return (
    <Card>
      <h2 className="page-title">Phiên bản giáo trình</h2>

      {/* FILTER */}
      <Space className="filter-bar">
        <Select placeholder="Chọn khoa" style={{ width: 180 }}>
          <Option value="it">Viện CNTT</Option>
          <Option value="log">Logistics</Option>
        </Select>

        <Select placeholder="Học kỳ" style={{ width: 180 }}>
          <Option value="hk1">HK1 2025–2026</Option>
        </Select>

        <Select placeholder="Trạng thái" style={{ width: 160 }}>
          <Option value="draft">Nháp</Option>
          <Option value="submitted">Chờ duyệt</Option>
          <Option value="approved">Đã duyệt</Option>
          <Option value="rejected">Từ chối</Option>
        </Select>
      </Space>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={mockData}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}
