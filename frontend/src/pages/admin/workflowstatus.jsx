import { useMemo, useState } from "react";
import { Card, Table, Tag, Select, Space, Timeline } from "antd";
import "./workflowstatus.css";

const { Option } = Select;


const mockData = [
  {
    key: 1,
    course_code: "CNPM",
    course_name: "Công nghệ phần mềm",
    semester: "HK1 2025–2026",
    version: "v2",
    current_step: "HOD",
    status: "in_review",
    timeline: [
      { role: "Giảng viên", action: "Gửi phê duyệt", date: "2026-01-10" },
      { role: "Trưởng bộ môn", action: "Đang thẩm định", date: "2026-01-15" },
    ],
  },
  {
    key: 2,
    course_code: "WEB",
    course_name: "Lập trình Web",
    semester: "HK1 2025–2026",
    version: "v1",
    current_step: "Approved",
    status: "approved",
    timeline: [
      { role: "Giảng viên", action: "Gửi phê duyệt", date: "2026-01-05" },
      { role: "Trưởng bộ môn", action: "Đồng ý", date: "2026-01-08" },
      { role: "Phòng đào tạo", action: "Đồng ý", date: "2026-01-10" },
      { role: "Ban giám hiệu", action: "Phê duyệt", date: "2026-01-12" },
    ],
  },
  {
    key: 3,
    course_code: "DBI",
    course_name: "Cơ sở dữ liệu",
    semester: "HK2 2024–2025",
    version: "v3",
    current_step: "Lecturer",
    status: "revision",
    timeline: [
      { role: "Giảng viên", action: "Gửi phê duyệt", date: "2025-12-20" },
      { role: "Trưởng bộ môn", action: "Yêu cầu chỉnh sửa", date: "2025-12-25" },
    ],
  },
];

/* ===== STATUS MAP ===== */
const STATUS_LABEL = {
  in_review: "Đang duyệt",
  approved: "Đã phê duyệt",
  revision: "Yêu cầu chỉnh sửa",
};

const STATUS_COLOR = {
  in_review: "orange",
  approved: "green",
  revision: "red",
};

export default function WorkflowStatus() {
  /* ===== FILTER STATE ===== */
  const [semester, setSemester] = useState();
  const [status, setStatus] = useState();

  /* ===== FILTER LOGIC ===== */
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchSemester =
        !semester || item.semester === semester;

      const matchStatus =
        !status || item.status === status;

      return matchSemester && matchStatus;
    });
  }, [semester, status]);

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
      title: "Bước hiện tại",
      dataIndex: "current_step",
      render: (s) => <Tag color="blue">{s}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => (
        <Tag color={STATUS_COLOR[s]}>
          {STATUS_LABEL[s]}
        </Tag>
      ),
    },
    {
      title: "Tiến trình duyệt",
      render: (r) => (
        <Timeline
          className="workflow-timeline"
          items={r.timeline.map((t) => ({
            children: (
              <div>
                <b>{t.role}</b> – {t.action}
                <div className="timeline-date">{t.date}</div>
              </div>
            ),
          }))}
        />
      ),
    },
  ];

  return (
    <Card className="workflow-status-page">
      <h2 className="page-title">Theo dõi trạng thái phê duyệt</h2>

      {/* ===== FILTER ===== */}
      <Space className="filter-bar">
        <Select
          placeholder="Học kỳ"
          style={{ width: 180 }}
          allowClear
          value={semester}
          onChange={setSemester}
        >
          <Option value="HK1 2025–2026">HK1 2025–2026</Option>
          <Option value="HK2 2024–2025">HK2 2024–2025</Option>
        </Select>

        <Select
          placeholder="Trạng thái"
          style={{ width: 200 }}
          allowClear
          value={status}
          onChange={setStatus}
        >
          <Option value="in_review">Đang duyệt</Option>
          <Option value="approved">Đã phê duyệt</Option>
          <Option value="revision">Yêu cầu chỉnh sửa</Option>
        </Select>
      </Space>

      {/* ===== TABLE ===== */}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
}
