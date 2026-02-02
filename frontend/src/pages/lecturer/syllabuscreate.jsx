import { useState } from "react";
import { Upload, Button, Input, Card, message, Modal } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./syllabuscreate.css";

export default function LecturerSyllabusCreate() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [credits, setCredits] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // UPLOAD CONFIG (CHUẨN ANTD)
  // =========================
  const uploadProps = {
    multiple: true,
    fileList: files,
    beforeUpload: (file) => {
      setFiles((prev) => [...prev, file]);
      return false; // chặn auto upload
    },
    onRemove: (file) => {
      setFiles((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async () => {
    if (!courseCode.trim() || !courseName.trim()) {
      message.warning("Xin vui lòng nhập đầy đủ mã và tên học phần");
      return;
    }

    const creditNumber = Number(credits);
    if (!creditNumber || creditNumber <= 0) {
      message.warning("Số tín chỉ không hợp lệ");
      return;
    }

    if (files.length === 0) {
      message.warning("Xin vui lòng tải lên ít nhất một file giáo trình");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("course_code", courseCode.trim());
      formData.append("course_name", courseName.trim());
      formData.append("credits", creditNumber);

      files.forEach((file) => {
        // ✅ AntD UploadFile → lấy file gốc
        formData.append("files", file.originFileObj || file);
      });

      await api.post("/api/lecturer/syllabuses", formData);
      // ❌ KHÔNG set Content-Type tay

      Modal.success({
        title: "Tạo giáo trình thành công",
        content: "Giáo trình đã được gửi vào hệ thống và đang chờ phê duyệt.",
        onOk: () => navigate("/lecturer/syllabuses"),
      });
    } catch (err) {
      console.error("CREATE SYLLABUS ERROR:", err);

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        message.error(detail.map((e) => e.msg).join(", "));
      } else if (typeof detail === "string") {
        message.error(detail);
      } else {
        message.error("Xin lỗi, gửi giáo trình không thành công");
      }
    } finally {
      setLoading(false);
    }
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
          <p>Kéo thả hoặc click để tải lên nhiều file</p>
          <p className="ant-upload-hint">
            Hỗ trợ: PDF, DOCX, PPTX, XLSX, ZIP, source code…
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
          Gửi phê duyệt
        </Button>
      </div>
    </div>
  );
}
