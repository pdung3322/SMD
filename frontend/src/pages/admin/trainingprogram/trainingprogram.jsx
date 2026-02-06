import { useEffect, useState } from "react";
import { Collapse, Typography, Spin, Empty, message, Tag } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import api from "../../../services/api";
import "./trainingprogram.css";

const { Title, Text } = Typography;
const { Panel } = Collapse;

export default function TrainingProgram() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/training-programs")
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        message.error("Không thể tải chương trình đào tạo");
      })
      .finally(() => setLoading(false));
  }, []);

  const openPdf = (path) => {
    if (!path) {
      message.info("Chương trình đào tạo chưa được cập nhật");
      return;
    }
    window.open(
  `http://localhost:8000/api/training-programs/file?path=${path}`,
  "_blank"
);

  };

  if (loading) {
    return (
      <div className="tp-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <Empty description="Chưa có chương trình đào tạo" />;
  }

  return (
    <div className="tp-container">
      <div className="page-title">
        Chương trình đào tạo
      </div>


      {data.map((major) => (
        <div key={major.major_name} className="tp-major">
          <Title level={4} className="tp-major-title">
            {major.major_name}
          </Title>

          <Collapse accordion bordered={false}>
            {major.specializations.map((spec) => (
              <Panel
                header={
                  <span className="tp-spec-title">
                    {spec.specialization_name}
                  </span>
                }
                key={spec.specialization_id}
              >
                {spec.programs.length === 0 ? (
                  <Text type="secondary">
                    Chưa có chương trình đào tạo
                  </Text>
                ) : (
                  <div className="tp-program-list">
                    {spec.programs.map((p) => (
                      <div
                        key={p.academic_year}
                        className="tp-program-item"
                        onClick={() => openPdf(p.file_path)}
                      >
                        <FilePdfOutlined className="tp-pdf-icon" />
                        <span className="tp-program-text">
                          Khóa {p.academic_year}
                        </span>
                        <Tag color="blue">PDF</Tag>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            ))}
          </Collapse>
        </div>
      ))}
    </div>
  );
}
