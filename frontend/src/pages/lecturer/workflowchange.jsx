import { Card, Timeline } from "antd";
import "./workflowchange.css";

export default function LecturerWorkflowChange() {
  return (
    <Card>
      <h2 className="page-title">Thay đổi quy trình làm việc</h2>

      <Timeline
        items={[
          { children: "2025-09-01: Áp dụng quy trình mới" },
          { children: "2025-10-01: Bổ sung bước phản hồi" },
        ]}
      />
    </Card>
  );
}
