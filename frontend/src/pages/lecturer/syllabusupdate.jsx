import { Card, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./comments.css";

export default function LecturerSyllabusUpdate() {
  return (
    <Card>
      <h2 className="page-title">Cập nhật giáo trình theo yêu cầu</h2>

      <Upload>
        <Button icon={<UploadOutlined />}>
          Upload file giáo trình mới
        </Button>
      </Upload>

      <Button type="primary" style={{ marginTop: 16 }}>
        Lưu cập nhật
      </Button>
    </Card>
  );
}
