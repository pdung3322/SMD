import { Card, Tag } from "antd";
import "./workflowconfig.css";

export default function WorkflowConfig() {
  return (
    <div className="workflow-page">
      <h2 className="page-title">Cấu hình luồng duyệt giáo trình</h2>

      {/* ===== WORKFLOW OVERVIEW ===== */}
      <Card className="workflow-card">
        <h3 className="section-title">Luồng duyệt hiện tại</h3>

        <div className="workflow-steps">
          <div className="workflow-step">
            <div className="step-index">1</div>
            <div className="step-content">
              <div className="step-title">Giảng viên</div>
              <div className="step-desc">
                Tạo giáo trình và gửi phê duyệt
              </div>
              <Tag color="blue">Khởi tạo</Tag>
            </div>
          </div>

          <div className="workflow-arrow">→</div>

          <div className="workflow-step">
            <div className="step-index">2</div>
            <div className="step-content">
              <div className="step-title">Trưởng bộ môn</div>
              <div className="step-desc">
                Thẩm định nội dung & CLO
              </div>
              <Tag color="orange">Thẩm định</Tag>
            </div>
          </div>

          <div className="workflow-arrow">→</div>

          <div className="workflow-step">
            <div className="step-index">3</div>
            <div className="step-content">
              <div className="step-title">Phòng đào tạo</div>
              <div className="step-desc">
                Kiểm tra PLO & quy định đào tạo
              </div>
              <Tag color="purple">Kiểm tra</Tag>
            </div>
          </div>

          <div className="workflow-arrow">→</div>

          <div className="workflow-step">
            <div className="step-index">4</div>
            <div className="step-content">
              <div className="step-title">Ban giám hiệu</div>
              <div className="step-desc">
                Phê duyệt cuối cùng
              </div>
              <Tag color="green">Phê duyệt</Tag>
            </div>
          </div>
        </div>
      </Card>

      {/* ===== NOTE ===== */}
      <Card className="workflow-card">
        <h3 className="section-title">Ghi chú</h3>
        <ul className="workflow-note">
          <li>Mỗi bước có thể yêu cầu chỉnh sửa và trả về bước trước.</li>
          <li>Giáo trình chỉ được sử dụng khi đã được phê duyệt cuối.</li>
          <li>Luồng duyệt có thể thay đổi theo từng năm học.</li>
        </ul>
      </Card>
    </div>
  );
}
