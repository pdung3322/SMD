import { useEffect, useState } from "react";
import {
  Upload,
  Button,
  Input,
  Card,
  message,
  Spin,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./syllabuscreate.css";

export default function LecturerSyllabusEdit() {
  const { syllabusId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [courseInfo, setCourseInfo] = useState(null);
  const [files, setFiles] = useState([]);
  const [note, setNote] = useState("");

  // =========================
  // LOAD SYLLABUS DETAIL
  // =========================
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(
          `/api/lecturer/syllabuses/${syllabusId}`
        );
        setCourseInfo(res.data?.data || res.data);
      } catch (err) {
        message.error("Không thể tải thông tin giáo trình");
        navigate("/lecturer/syllabuses");
      } finally {
        setLoadingData(false);
      }
    };

    fetchDetail();
  }, [syllabusId, navigate]);

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
      setFiles((prev) =>
        prev.filter((f) => f.uid !== file.uid)
      );
    },
  };

  // =========================
  // SUBMIT NEW VERSION
  // =========================
  const handleSubmit = async () => {
    if (files.length === 0) {
      message.warning("Vui lòng tải lên ít nhất 1 file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("note", note);

      files.forEach((file) => {
        formData.append(
          "files",
          file.originFileObj || file
        );
      });

      await api.post(
        `/api/lecturer/syllabuses/${syllabusId}/versions`,
        formData
      );

      message.success("Gửi phiên bản chỉnh sửa thành công");
      navigate("/lecturer/syllabuses");
    } catch (err) {
      console.error(err);
      message.error("Gửi chỉnh sửa thất bại");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RENDER
  // =========================
  if (loadingData) {
    return <Spin style={{ marginTop: 100 }} />;
  }

  return (
    <div className="syllabus-create-page">
      <h2 className="page-title">Chỉnh sửa giáo trình</h2>

      {/* ===== INFO (READ ONLY) ===== */}
      <Card title="Thông tin học phần" className="block-card">
        <p>
          <b>Mã học phần:</b> {courseInfo?.course_code}
        </p>
        <p>
          <b>Tên học phần:</b> {courseInfo?.course_name}
        </p>
        <p>
          <b>Số tín chỉ:</b> {courseInfo?.credits}
        </p>
      </Card>

      {/* ===== UPLOAD ===== */}
      <Card title="Tài liệu chỉnh sửa" className="block-card">
        <Upload.Dragger {...uploadProps} className="upload-area">
          <p className="upload-icon">
            <UploadOutlined />
          </p>
          <p>Kéo thả hoặc click để tải file mới</p>
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
          placeholder="Ghi chú chỉnh sửa (bắt buộc nếu bị yêu cầu sửa)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="note-area"
        />
      </Card>

      {/* ===== ACTION ===== */}
      <div className="action-bar">
        <Button
          onClick={() => navigate("/lecturer/syllabuses")}
        >
          Hủy
        </Button>

        <Button
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Gửi chỉnh sửa
        </Button>
      </div>
    </div>
  );
}
