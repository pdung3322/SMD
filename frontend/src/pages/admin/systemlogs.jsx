import { useMemo, useState } from "react";
import { Card, Table, Tag, Select, Space, Button, Modal } from "antd";
import "./systemlogs.css";

const { Option } = Select;


const mockLogs = [
  {
    key: 1,
    time: "2026-02-06 10:15:22",
    user: "admin@ut.edu.vn",
    action: "LOGIN",
    module: "Authentication",
    level: "info",
    detail: "Đăng nhập thành công",
  },
  {
    key: 2,
    time: "2026-02-06 10:18:40",
    user: "lecturer1@ut.edu.vn",
    action: "SUBMIT_SYLLABUS",
    module: "Syllabus",
    level: "info",
    detail: "Gửi giáo trình CNPM v2 để phê duyệt",
  },
  {
    key: 3,
    time: "2026-02-06 10:25:10",
    user: "hod@ut.edu.vn",
    action: "REJECT_SYLLABUS",
    module: "Workflow",
    level: "warning",
    detail: "Yêu cầu chỉnh sửa CLO giáo trình DBI",
  },
  {
    key: 4,
    time: "2026-02-06 10:30:55",
    user: "system",
    action: "API_ERROR",
    module: "Backend",
    level: "error",
    detail: "500 Internal Server Error tại /api/syllabus",
  },
];

/* ===== TAG MAP ===== */
const LEVEL_COLOR = {
  info: "blue",
  warning: "orange",
  error: "red",
};

export default function SystemLogs() {
  const [level, setLevel] = useState();
  const [module, setModule] = useState();
  const [open, setOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  /* ===== FILTER ===== */
  const filteredLogs = useMemo(() => {
    return mockLogs.filter((l) => {
      const matchLevel = !level || l.level === level;
      const matchModule = !module || l.module === module;
      return matchLevel && matchModule;
    });
  }, [level, module]);

  const columns = [
    {
      title: "Thời gian",
      dataIndex: "time",
      width: 170,
    },
    {
      title: "Người dùng",
      dataIndex: "user",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (a) => <Tag>{a}</Tag>,
    },
    {
      title: "Module",
      dataIndex: "module",
    },
    {
      title: "Mức độ",
      dataIndex: "level",
      render: (l) => <Tag color={LEVEL_COLOR[l]}>{l.toUpperCase()}</Tag>,
    },
    {
      title: "Thao tác",
      render: (r) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedLog(r);
            setOpen(true);
          }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Card className="system-logs-page">
      <h2 className="page-title">Nhật ký hệ thống</h2>

      {/* ===== FILTER BAR ===== */}
      <Space className="filter-bar">
        <Select
          placeholder="Mức độ"
          allowClear
          style={{ width: 160 }}
          value={level}
          onChange={setLevel}
        >
          <Option value="info">Info</Option>
          <Option value="warning">Warning</Option>
          <Option value="error">Error</Option>
        </Select>

        <Select
          placeholder="Module"
          allowClear
          style={{ width: 180 }}
          value={module}
          onChange={setModule}
        >
          <Option value="Authentication">Authentication</Option>
          <Option value="Syllabus">Syllabus</Option>
          <Option value="Workflow">Workflow</Option>
          <Option value="Backend">Backend</Option>
        </Select>
      </Space>

      {/* ===== TABLE ===== */}
      <Table
        columns={columns}
        dataSource={filteredLogs}
        pagination={{ pageSize: 6 }}
      />

      {/* ===== MODAL DETAIL ===== */}
      <Modal
        open={open}
        title="Chi tiết nhật ký"
        footer={null}
        onCancel={() => setOpen(false)}
      >
        {selectedLog && (
          <div className="log-detail">
            <p><b>Thời gian:</b> {selectedLog.time}</p>
            <p><b>Người dùng:</b> {selectedLog.user}</p>
            <p><b>Hành động:</b> {selectedLog.action}</p>
            <p><b>Module:</b> {selectedLog.module}</p>
            <p><b>Mức độ:</b> {selectedLog.level}</p>
            <p><b>Chi tiết:</b> {selectedLog.detail}</p>
          </div>
        )}
      </Modal>
    </Card>
  );
}
