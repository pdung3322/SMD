import { Card, Table, Tag, Select, Space } from "antd";
import "./syllabusstatus.css";

const { Option } = Select;

const mockData = [
  {
    key: 1,
    course_code: "CNPM",
    course_name: "Công nghệ phần mềm",
    semester: "HK1 2025–2026",
    version: "v2",
    created_by: "Nguyễn Văn A",
    updated_at: "2026-01-15",
    status: "submitted",
  },
  {
    key: 2,
    course_code: "WEB",
    course_name: "Lập trình Web",
    semester: "HK1 2025–2026",
    version: "v1",
    created_by: "Trần Thị B",
    updated_at: "2026-01-05",
    status: "approved",
  },
  {
    key: 3,
    course_code: "DBI",
    course_name: "Cơ sở dữ liệu",
    semester: "HK2 2024–2025",
    version: "v3",
    created_by: "Lê Văn C",
    updated_at: "2025-12-20",
    status: "rejected",
  },
];

/* ===== STATUS MAP ===== */
const STATUS_LABEL = {
  draft: "Nháp",
  submitted: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

const STATUS_COLOR = {
  draft: "default",
  submitted: "orange",
  approved: "green",
  rejected: "red",
};

export default function SyllabusStatus() {
  const columns = [
    {
      title: "Môn học",
      render: (r) => (
        <div>
          <div className="course-name">{r.course_name}</div>
          <div className="course-code">{r.course_code}</div>
        </div>
      ),
    },
    {
      title: "Học kỳ",
      dataIndex: "semester",
    },
    {
      title: "Phiên bản",
      dataIndex: "version",
      align: "center",
    },
    {
      title: "Người tạo",
      dataIndex: "created_by",
    },
    {
      title: "Cập nhật gần nhất",
      dataIndex: "updated_at",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => (
        <Tag color={STATUS_COLOR[s]} className="status-tag">
          {STATUS_LABEL[s]}
        </Tag>
      ),
    },
  ];

  return (
    <Card className="syllabus-status-page">
      <h2 className="page-title">Theo dõi trạng thái giáo trình</h2>

      {/* ===== FILTER BAR ===== */}
      <Space className="filter-bar">
        <Select placeholder="Chọn học kỳ" style={{ width: 180 }}>
          <Option value="hk1">HK1 2025–2026</Option>
          <Option value="hk2">HK2 2024–2025</Option>
        </Select>

        <Select placeholder="Trạng thái" style={{ width: 160 }}>
          <Option value="draft">Nháp</Option>
          <Option value="submitted">Chờ duyệt</Option>
          <Option value="approved">Đã duyệt</Option>
          <Option value="rejected">Từ chối</Option>
        </Select>
      </Space>

      {/* ===== TABLE ===== */}
      <Table
        columns={columns}
        dataSource={mockData}
        pagination={{ pageSize: 8 }}
      />
    </Card>
  );
}
