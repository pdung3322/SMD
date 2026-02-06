import { useState } from "react";
import {
  Card,
  Select,
  Typography,
  Button,
  Input,
  Descriptions,
  Tag,
  message,
} from "antd";
import "./syllabusapproval.css";
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

/* ===== MOCK DATA ===== */
const mockSyllabuses = [
  {
    id: 1,
    code: "CNPM01",
    name: "Công nghệ phần mềm",
    versions: [
      {
        id: 11,
        version: "v1",
        created_at: "2025-02-06",
        status: "draft",
      },
    ],
  },
  {
    id: 2,
    code: "CTDL01",
    name: "Cấu trúc dữ liệu",
    versions: [
      {
        id: 21,
        version: "v1",
        created_at: "2025-09-10",
        status: "draft",
      },
    ],
  },
];

export default function LecturerSyllabusApproval() {
  const [syllabusId, setSyllabusId] = useState(null);
  const [versionId, setVersionId] = useState(null);
  const [note, setNote] = useState("");

  const syllabus = mockSyllabuses.find(s => s.id === syllabusId);
  const version = syllabus?.versions.find(v => v.id === versionId);

  const handleSubmit = () => {
    if (!syllabus || !version) {
      message.warning("Vui lòng chọn giáo trình và phiên bản");
      return;
    }

  
    console.log({
      syllabus_id: syllabus.id,
      version_id: version.id,
      note,
    });

    message.success("Đã gửi giáo trình phê duyệt thành công");
    setNote("");
  };

  return (
    <Card>
      <h2 className="approval-title">
  Gửi giáo trình phê duyệt
</h2>

      {/* ===== SELECT SYLLABUS ===== */}
      <div style={{ maxWidth: 500 }}>
        <Select
          placeholder="Chọn giáo trình"
          style={{ width: "100%", marginBottom: 16 }}
          onChange={(id) => {
            setSyllabusId(id);
            setVersionId(null);
          }}
        >
          {mockSyllabuses.map(s => (
            <Option key={s.id} value={s.id}>
              {s.code} - {s.name}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Chọn phiên bản giáo trình"
          style={{ width: "100%", marginBottom: 16 }}
          disabled={!syllabus}
          onChange={setVersionId}
        >
          {syllabus?.versions.map(v => (
            <Option key={v.id} value={v.id}>
              {v.version} - {v.created_at}
            </Option>
          ))}
        </Select>
      </div>

      {/* ===== INFO ===== */}
      {syllabus && version && (
        <Descriptions bordered size="small" column={1}>
          <Descriptions.Item label="Mã học phần">
            {syllabus.code}
          </Descriptions.Item>
          <Descriptions.Item label="Tên học phần">
            {syllabus.name}
          </Descriptions.Item>
          <Descriptions.Item label="Phiên bản">
            {version.version}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {version.created_at}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color="blue">Nháp</Tag>
          </Descriptions.Item>
        </Descriptions>
      )}

      {/* ===== NOTE ===== */}
      <div style={{ marginTop: 20, maxWidth: 700 }}>
        <TextArea
          rows={4}
          placeholder="Ghi chú gửi hội đồng / bộ môn (không bắt buộc)"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </div>

      {/* ===== ACTION ===== */}
      <div style={{ marginTop: 20 }}>
        <Button type="primary" onClick={handleSubmit}>
          Gửi phê duyệt
        </Button>
      </div>
    </Card>
  );
}
