import { useParams, useNavigate } from "react-router-dom";
import { Card, Tag, Button, Divider, List, Empty } from "antd";

/* ================= MOCK DATA ================= */
const MOCK_SYLLABUS_DETAIL = {
  1: {
    course_name: "Triết học Mác – Lênin",
    status: "APPROVED",
    versions: [
      {
        version: 1,
        note: "Giáo trình chuẩn Bộ GD",
        files: [
          {
            name: "Triết học Mác – Lênin.pdf",
            url: "/uploads/syllabus/TRIET/triet_v1.pdf",
          },
        ],
      },
    ],
  },

  2: {
    course_name: "Công nghệ phần mềm",
    status: "PENDING",
    versions: [
      {
        version: 1,
        note: "Bản đầu tiên",
        files: [
          {
            name: "Giáo trình CNPM.pdf",
            url: "/uploads/syllabus/CNPM/cnpm_v1.pdf",
          },
        ],
      },
      {
        version: 2,
        note: "Cập nhật góp ý hội đồng",
        files: [
          {
            name: "Giáo trình CNPM v2.pdf",
            url: "/uploads/syllabus/CNPM/cnpm_v2.pdf",
          },
        ],
      },
    ],
  },

  3: {
    course_name: "Kho dữ liệu & Hệ thống hỗ trợ quyết định",
    status: "DRAFT",
    versions: [
      {
        version: 1,
        note: "Bản nháp",
        files: [
          {
            name: "Kho dữ liệu.pdf",
            url: "/uploads/syllabus/DW_DSS/dw_v1.pdf",
          },
        ],
      },
    ],
  },

  4: {
    course_name: "Hệ điều hành",
    status: "APPROVED",
    versions: [
      {
        version: 1,
        note: "Giáo trình chính thức",
        files: [
          {
            name: "Hệ điều hành.pdf",
            url: "/uploads/syllabus/HDH/hdh_v1.pdf",
          },
        ],
      },
    ],
  },

  5: {
    course_name: "Phân tích & thiết kế hệ thống",
    status: "REJECTED",
    versions: [
      {
        version: 1,
        note: "Thiếu chuẩn CLO / PLO",
        files: [
          {
            name: "PTTKHT.pdf",
            url: "/uploads/syllabus/PTTKHT/pttkht_v1.pdf",
          },
        ],
      },
    ],
  },

  6: {
    course_name: "Thương mại điện tử",
    status: "PENDING",
    versions: [
      {
        version: 1,
        note: "Đang chờ duyệt",
        files: [
          {
            name: "Thương mại điện tử.pdf",
            url: "/uploads/syllabus/TMDT/tmdt_v1.pdf",
          },
        ],
      },
    ],
  },
};

/* ================= HELPER ================= */
const renderStatus = (status) => {
  const map = {
    APPROVED: { text: "Đã phê duyệt", color: "green" },
    PENDING: { text: "Chờ phê duyệt", color: "orange" },
    REJECTED: { text: "Bị từ chối", color: "red" },
    DRAFT: { text: "Bản nháp", color: "default" },
  };

  const s = map[status] || map.DRAFT;
  return <Tag color={s.color}>{s.text}</Tag>;
};

const canEdit = (status) =>
  status === "DRAFT" || status === "REJECTED";

/* ================= COMPONENT ================= */
export default function LecturerSyllabusDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const data = MOCK_SYLLABUS_DETAIL[id];

  if (!data) {
    return <Empty description="Không tìm thấy giáo trình" />;
  }

  return (
    <div style={{ padding: 24 }}>
      <Button onClick={() => navigate(-1)}>← Quay lại</Button>

      {/* ===== HEADER ===== */}
      <Card style={{ marginTop: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ marginBottom: 8 }}>{data.course_name}</h2>
            Trạng thái: {renderStatus(data.status)}
          </div>

          {canEdit(data.status) && (
            <Button
              type="primary"
              onClick={() =>
                navigate(`/lecturer/syllabus/${id}/edit`)
              }
            >
              Chỉnh sửa / cập nhật
            </Button>
          )}
        </div>
      </Card>

      <Divider />

      {/* ===== VERSIONS ===== */}
      {data.versions.map((v) => (
        <Card
          key={v.version}
          title={`Phiên bản ${v.version}`}
          style={{ marginBottom: 16 }}
        >
          <p>
            <b>Ghi chú:</b> {v.note}
          </p>

          <List
            header={<b>Tài liệu đính kèm</b>}
            dataSource={v.files}
            renderItem={(file) => (
              <List.Item>
                <a
                  href={file.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 {file.name}
                </a>
              </List.Item>
            )}
          />
        </Card>
      ))}
    </div>
  );
}
