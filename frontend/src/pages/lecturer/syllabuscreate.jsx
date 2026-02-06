import { useState } from "react";
import { Upload, Button, Input, Card, message, Modal } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./syllabuscreate.css";

export default function LecturerSyllabusCreate() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [credits, setCredits] = useState("");
  const [loading, setLoading] = useState(false);

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

  // =========================
  // SUBMIT (MOCK)
  // =========================
  const handleSubmit = () => {
    if (!courseCode.trim() || !courseName.trim()) {
      message.warning("Vui lòng nhập đầy đủ mã và tên học phần");
      return;
    }

    const creditNumber = Number(credits);
    if (!creditNumber || creditNumber <= 0) {
      message.warning("Số tín chỉ không hợp lệ");
      return;
    }

    if (files.length === 0) {
      message.warning("Vui lòng tải lên ít nhất 1 file giáo trình");
      return;
    }

    setLoading(true);

    // ===== MOCK SYLLABUS OBJECT =====
    const newSyllabus = {
      syllabus_id: Date.now(),
      course_code: courseCode.trim(),
      course_name: courseName.trim(),
      credits: creditNumber,
      updated_at: new Date().toISOString(),
      status: "DRAFT", // 🔥 QUAN TRỌNG
      versions: [
        {
          version: 1,
          note: "Bản nháp ban đầu",
          files: files.map((f) => ({
            name: f.name,
            url: "#", // mock download
          })),
        },
      ],
    };

    // ===== SAVE LOCALSTORAGE =====
    const oldList =
      JSON.parse(localStorage.getItem("LECTURER_SYLLABUS_LIST")) || [];

    localStorage.setItem(
      "LECTURER_SYLLABUS_LIST",
      JSON.stringify([newSyllabus, ...oldList])
    );

    setTimeout(() => {
      setLoading(false);

      Modal.success({
        title: "Tạo giáo trình thành công",
        content: "Giáo trình đang ở trạng thái BẢN NHÁP.",
        onOk: () => navigate("/lecturer/syllabuses"),
      });
    }, 500);
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="syllabus-create-page">
      <h2 className="page-title">Tạo giáo trình học phần</h2>

      <Card title="Thông tin học phần" className="block-card">
        <div className="form-row">
          <Input
            placeholder="Mã học phần"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          />
          <Input
            placeholder="Tên học phần"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          <Input
            placeholder="Số tín chỉ"
            type="number"
            min={1}
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
          />
        </div>
      </Card>

      <Card title="Tài liệu giáo trình" className="block-card">
        <Upload.Dragger {...uploadProps} className="upload-area">
          <p className="upload-icon">
            <UploadOutlined />
          </p>
          <p>Kéo thả hoặc click để tải lên file</p>
          <p className="ant-upload-hint">
            PDF, DOCX, PPTX, XLSX, ZIP…
          </p>
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
      </Card>

      <div className="action-bar">
        <Button
          onClick={() => navigate("/lecturer/syllabuses")}
          disabled={loading}
        >
          Hủy
        </Button>
        <Button type="primary" loading={loading} onClick={handleSubmit}>
          Lưu bản nháp
        </Button>
      </div>
    </div>
  );
}
