import { Card, Table, Tag, Select, Input, Space, Button } from "antd";
import { useState } from "react";
import "./syllabuslist.css";

const { Option } = Select;

const Syllabuses = [
  {
    syllabus_id: 1,
    course_code: "CNPM",
    course_name: "Công nghệ phần mềm",
    credits: 3,
    faculty_name: "Viện Công nghệ Thông tin và Điện – Điện tử",
    semester: "Học kỳ 1 (2025–2026)",
    latest_version: "v2",
    status: "SUBMITTED",
  },
  {
    syllabus_id: 2,
    course_code: "WEB",
    course_name: "Lập trình Web",
    credits: 3,
    faculty_name: "Viện Công nghệ Thông tin và Điện – Điện tử",
    semester: "Học kỳ 1 (2025–2026)",
    latest_version: "v1",
    status: "APPROVED",
  },
  {
    syllabus_id: 3,
    course_code: "CSDL",
    course_name: "Cơ sở dữ liệu",
    credits: 4,
    faculty_name: "Viện Công nghệ Thông tin và Điện – Điện tử",
    semester: "Học kỳ 2 (2024–2025)",
    latest_version: "v3",
    status: "REVISION_REQUIRED",
  },
];

const STATUS_MAP = {
  DRAFT: { label: "Bản nháp", color: "default" },
  SUBMITTED: { label: "Chờ duyệt", color: "orange" },
  APPROVED: { label: "Đã duyệt", color: "green" },
  REVISION_REQUIRED: { label: "Cần chỉnh sửa", color: "red" },
};

export default function SyllabusList() {
  const [faculty, setFaculty] = useState(null);
  const [status, setStatus] = useState(null);
  const [keyword, setKeyword] = useState("");

  const filteredData = Syllabuses.filter((item) => {
    return (
      (!faculty || item.faculty_name === faculty) &&
      (!status || item.status === status) &&
      (!keyword ||
        item.course_name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.course_code.toLowerCase().includes(keyword.toLowerCase()))
    );
  });

  const columns = [
    {
      title: "Mã học phần",
      dataIndex: "course_code",
      width: 120,
    },
    {
      title: "Tên học phần",
      dataIndex: "course_name",
    },
    {
      title: "Số tín chỉ",
      dataIndex: "credits",
      width: 100,
    },
    {
      title: "Khoa",
      dataIndex: "faculty_name",
    },
    {
      title: "Học kỳ",
      dataIndex: "semester",
      width: 180,
    },
    {
      title: "Phiên bản mới nhất",
      dataIndex: "latest_version",
      width: 160,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 160,
      render: (status) => {
        const s = STATUS_MAP[status];
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    {
      title: "Hành động",
      width: 120,
      render: (_, record) => (
        <Button type="link">
          Xem
        </Button>
      ),
    },
  ];

  return (
    <Card className="admin-syllabus-list">
      <h2 className="page-title">
      Danh sách giáo trình học phần
      </h2>


      {/* FILTER */}
      <Space className="filter-bar" wrap>
        <Select
          placeholder="Chọn khoa"
          allowClear
          style={{ width: 220 }}
          onChange={setFaculty}
        >
          <Option value="Viện Công nghệ Thông tin và Điện – Điện tử">
            Viện Công nghệ Thông tin
          </Option>
          <Option value="Trung tâm Logistics">
            Trung tâm Logistics
          </Option>
          <Option value="Viện Kinh tế và Phát triển Giao thông Vận tải">
            Viện Kinh tế và Phát triển Giao thông Vận tải
          </Option>
          <Option value="Khoa cơ bản">
            Khoa cơ bản
          </Option>
          <Option value="Phòng Đào tạo">
            Phòng Đào tạo
          </Option>
        </Select>

        <Select
          placeholder="Trạng thái"
          allowClear
          style={{ width: 200 }}
          onChange={setStatus}
        >
          {Object.keys(STATUS_MAP).map((key) => (
            <Option key={key} value={key}>
              {STATUS_MAP[key].label}
            </Option>
          ))}
        </Select>

        <Input.Search
          placeholder="Tìm theo mã / tên học phần"
          allowClear
          style={{ width: 260 }}
          onSearch={setKeyword}
        />
      </Space>

      {/* TABLE */}
      <Table
        rowKey="syllabus_id"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
}
