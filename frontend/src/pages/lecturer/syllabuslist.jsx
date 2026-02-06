import { useEffect, useState } from "react";
import { Table, Button, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import "./syllabusList.css";

export default function LecturerSyllabusList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    // ===== MOCK DATA =====
    const mockData = [
      {
        syllabus_id: 1,
        course_code: "TRIET",
        course_name: "Triết học Mác – Lênin",
        updated_at: "2026-02-03T01:16:14",
        status: "APPROVED",
      },
      {
        syllabus_id: 2,
        course_code: "DW_DSS",
        course_name: "Kho dữ liệu và Hệ thống hỗ trợ quyết định",
        updated_at: "2026-01-05T09:54:28",
        status: "DRAFT",
      },
      {
        syllabus_id: 3,
        course_code: "HDH",
        course_name: "Hệ điều hành",
        updated_at: "2026-01-05T09:54:28",
        status: "APPROVED",
      },
      {
        syllabus_id: 4,
        course_code: "PTTKHT",
        course_name: "Phân tích & thiết kế hệ thống",
        updated_at: "2026-01-10T10:15:00",
        status: "REJECTED",
      },
      {
        syllabus_id: 5,
        course_code: "TMDT",
        course_name: "Thương mại điện tử",
        updated_at: "2026-01-12T08:30:00",
        status: "PENDING",
      },
    {
        syllabus_id: 6,
        course_code: "CNPM",
        course_name: "Công nghệ phần mềm",
        updated_at: "2026-02-06T020:54:28",
        status: "PENDING",
      },
      ];

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 400);
  }, []);

  // ===== STATUS (TIẾNG VIỆT) =====
  const renderStatus = (status) => {
    let color = "default";
    let text = "Không xác định";

    switch (status) {
      case "APPROVED":
        color = "green";
        text = "Đã phê duyệt";
        break;
      case "PENDING":
        color = "orange";
        text = "Chờ phê duyệt";
        break;
      case "REJECTED":
        color = "red";
        text = "Bị từ chối";
        break;
      case "DRAFT":
        color = "default";
        text = "Bản nháp";
        break;
      default:
        break;
    }

    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Mã học phần",
      dataIndex: "course_code",
    },
    {
      title: "Tên học phần",
      dataIndex: "course_name",
      render: (text) => <span className="course-name">{text}</span>,
    },
    {
      title: "Cập nhật",
      dataIndex: "updated_at",
      render: (value) => new Date(value).getFullYear(),
      width: 100,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: renderStatus,
      width: 140,
    },
    {
      title: "Thao tác",
      width: 180,
      render: (_, record) => (
        <Button
          className="btn-detail"
          onClick={() =>
            navigate(`/lecturer/syllabuses/${record.syllabus_id}`)
          }
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="syllabus-list-page">
      <h2>Danh sách giáo trình</h2>

      <div className="syllabus-table">
        <Table
          rowKey="syllabus_id"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
}
