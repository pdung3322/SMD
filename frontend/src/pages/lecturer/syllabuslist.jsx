import { Table, Tag, Button, Space, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./syllabuslist.css";

// =========================
// MAP TRẠNG THÁI
// =========================
const statusMap = {
  DRAFT: { color: "default", label: "Nháp" },
  PENDING_REVIEW: { color: "processing", label: "Chờ duyệt (BM)" },
  PENDING_APPROVAL: { color: "processing", label: "Chờ duyệt (PĐT)" },
  REVISION_REQUIRED: { color: "error", label: "Yêu cầu chỉnh sửa" },
  APPROVED: { color: "success", label: "Đã phê duyệt" },
};

export default function LecturerSyllabusList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH DATA
  // =========================
  const fetchSyllabuses = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/lecturer/syllabuses");

      // chịu được cả 2 kiểu response:
      // 1) trả mảng trực tiếp
      // 2) { data: [...] }
      const list = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      setData(list);
    } catch (error) {
      console.error("Không thể tải danh sách giáo trình", error);
      message.error("Không thể tải danh sách giáo trình");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabuses();
  }, []);

  // =========================
  // TABLE COLUMNS
  // =========================
  const columns = [
    {
      title: "STT",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã học phần",
      dataIndex: "course_code",
    },
    {
      title: "Tên học phần",
      dataIndex: "course_name",
      render: (name) => name || "--",
    },
    {
      title: "Số tín chỉ",
      dataIndex: "credits",
      width: 90,
      align: "center",
    },
    {
      title: "Phiên bản",
      width: 90,
      align: "center",
      render: (_, record) =>
        `v${
          record.version_number ||
          record.latest_version?.version_number ||
          1
        }`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 180,
      render: (status) => {
        const s = statusMap[status] || {
          color: "default",
          label: status || "--",
        };
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    {
      title: "Cập nhật",
      dataIndex: "updated_at",
      width: 140,
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "--",
    },
    {
      title: "Giáo trình",
      width: 260,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() =>
              navigate(`/lecturer/syllabus/${record.syllabus_id || record.id}`)
            }
          >
            Chi tiết
          </Button>

          <Button
            size="small"
            disabled={record.status === "APPROVED"}
            onClick={() =>
              navigate(
                `/lecturer/syllabus/${
                  record.syllabus_id || record.id
                }/edit`
              )
            }
          >
            Chỉnh sửa
          </Button>

          <Button
            size="small"
            onClick={() =>
              navigate(
                `/lecturer/syllabus/compare?syllabusId=${
                  record.syllabus_id || record.id
                }`
              )
            }
          >
            So sánh
          </Button>
        </Space>
      ),
    },
  ];

  // =========================
  // RENDER
  // =========================
  return (
    <div className="syllabus-list-page">
      <h2>Danh sách giáo trình học phần</h2>

      <Table
        rowKey={(record) => record.syllabus_id || record.id}
        className="syllabus-table"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
