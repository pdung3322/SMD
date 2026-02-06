import { useEffect, useState } from "react";
import {
  Upload,
  Button,
  Input,
  Card,
  message,
  Divider,
  List,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import "./syllabuscreate.css";

export default function LecturerSyllabusEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [syllabus, setSyllabus] = useState(null);
  const [files, setFiles] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let list =
      JSON.parse(localStorage.getItem("LECTURER_SYLLABUS_LIST")) || [];

    if (list.length === 0) {
      const mockCNPM = {
        syllabus_id: 2,
        course_code: "CNPM",
        course_name: "Công nghệ phần mềm",
        credits: 3,
        status: "DRAFT",
        updated_at: new Date().toISOString(),
        versions: [
          {
            version: 1,
            note: "Bản nháp ban đầu",
            files: [
              {
                name: "Giáo trình CNPM.pdf",
                url: "#",
              },
            ],
          },
        ],
      };
      list = [mockCNPM];
      localStorage.setItem(
        "LECTURER_SYLLABUS_LIST",
        JSON.stringify(list)
      );
    }

    const found = list.find(
      (s) => String(s.syllabus_id) === String(id)
    );

    if (!found) {
      message.error("Không tìm thấy giáo trình");
      navigate("/lecturer/syllabuses");
      return;
    }

    setSyllabus(found);
  }, [id, navigate]);

  // =========================
  // UPLOAD CONFIG
  // =========================
  const uploadProps = {
    multiple: true,
    fileList: files,
    beforeUpload: (file) => {
      setFiles((prev) => [...prev, file]);
      return false;
    },
    onRemove: (file) => {
      setFiles((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

 
  const handleSave = () => {
    if (files.length === 0) {
      message.warning("Vui lòng tải ít nhất 1 file");
      return;
    }

    setLoading(true);

    const newVersion = {
      version: syllabus.versions.length + 1,
      note: note || "Cập nhật nội dung giáo trình",
      files: files.map((f) => ({
        name: f.name,
        url: "#",
      })),
    };

    const updated = {
      ...syllabus,
      updated_at: new Date().toISOString(),
      versions: [...syllabus.versions, newVersion],
      status: "DRAFT", // 🔥 QUAN TRỌNG
    };

    const list =
      JSON.parse(localStorage.getItem("LECTURER_SYLLABUS_LIST")) || [];

    const newList = list.map((s) =>
      s.syllabus_id === syllabus.syllabus_id ? updated : s
    );

    localStorage.setItem(
      "LECTURER_SYLLABUS_LIST",
      JSON.stringify(newList)
    );

    setTimeout(() => {
      setLoading(false);
      message.success("Lưu chỉnh sửa thành công (Bản nháp)");
      navigate("/lecturer/syllabuses");
    }, 400);
  };

  if (!syllabus) return null;

  // =========================
  // UI
  // =========================
  return (
    <div className="syllabus-create-page">
      <h2 className="page-title">Chỉnh sửa / cập nhật giáo trình</h2>

      {/* INFO */}
      <Card title="Thông tin học phần" className="block-card">
        <p>
          <b>Mã học phần:</b> {syllabus.course_code}
        </p>
        <p>
          <b>Tên học phần:</b> {syllabus.course_name}
        </p>
        <p>
          <b>Số tín chỉ:</b> {syllabus.credits}
        </p>
        <p>
          <b>Trạng thái:</b> Bản nháp
        </p>
      </Card>

      {/* VERSIONS */}
      <Divider />
      <h3>Danh sách phiên bản</h3>

      {syllabus.versions.map((v) => (
        <Card
          key={v.version}
          title={`Phiên bản ${v.version}`}
          style={{ marginBottom: 12 }}
        >
          <p>
            <b>Ghi chú:</b> {v.note}
          </p>
          <List
            dataSource={v.files}
            renderItem={(f) => (
              <List.Item>📄 {f.name}</List.Item>
            )}
          />
        </Card>
      ))}

      {/* UPLOAD */}
      <Divider />
      <Card title="Tải lên phiên bản mới" className="block-card">
        <Upload.Dragger {...uploadProps}>
          <p className="upload-icon">
            <UploadOutlined />
          </p>
          <p>Kéo thả hoặc click để upload</p>
        </Upload.Dragger>

        {files.map((file) => (
          <div key={file.uid} className="file-item">
            {file.name}
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                setFiles((prev) =>
                  prev.filter((f) => f.uid !== file.uid)
                )
              }
            />
          </div>
        ))}

        <Input.TextArea
          rows={3}
          placeholder="Ghi chú chỉnh sửa"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ marginTop: 12 }}
        />
      </Card>

      {/* ACTION */}
      <div className="action-bar">
        <Button onClick={() => navigate("/lecturer/syllabuses")}>
          Hủy
        </Button>
        <Button
          type="primary"
          loading={loading}
          onClick={handleSave}
        >
          Lưu chỉnh sửa
        </Button>
      </div>
    </div>
  );
}
