import { useState } from "react";
import { Card, Select, Table, Typography, Tag } from "antd";
import "./syllabuscompare.css";

const { Title } = Typography;
const { Option } = Select;

const mockVersions = [
  {
    id: 1,
    version: "v1",
    created_at: "2025-09-01",
    created_by: "Nguyễn Văn A",
    description: "Phiên bản ban đầu",
    files: ["decuong.pdf", "slide_ch1.pptx"],
  },
  {
    id: 2,
    version: "v2",
    created_at: "2025-10-15",
    created_by: "Nguyễn Văn A",
    description: "Cập nhật theo góp ý bộ môn",
    files: ["decuong_v2.pdf", "slide_full.pptx"],
  },
  {
    id: 3,
    version: "v3",
    created_at: "2025-11-20",
    created_by: "Nguyễn Văn B",
    description: "Điều chỉnh chuẩn đầu ra",
    files: ["decuong_v3.pdf"],
  },
];

export default function LecturerSyllabusCompare() {
  const [leftId, setLeftId] = useState(null);
  const [rightId, setRightId] = useState(null);

  const left = mockVersions.find(v => v.id === leftId);
  const right = mockVersions.find(v => v.id === rightId);

  const columns = [
    {
      title: "Thuộc tính",
      dataIndex: "field",
      width: "30%",
    },
    {
      title: left ? left.version : "Phiên bản A",
      dataIndex: "left",
    },
    {
      title: right ? right.version : "Phiên bản B",
      dataIndex: "right",
    },
  ];

  const dataSource = [
    {
      key: "created_at",
      field: "Ngày tạo",
      left: left?.created_at || "-",
      right: right?.created_at || "-",
    },
    {
      key: "created_by",
      field: "Người tạo",
      left: left?.created_by || "-",
      right: right?.created_by || "-",
    },
    {
      key: "description",
      field: "Mô tả",
      left: left?.description || "-",
      right: right?.description || "-",
    },
    {
      key: "files",
      field: "File đính kèm",
      left: left
        ? left.files.map(f => <Tag key={f}>{f}</Tag>)
        : "-",
      right: right
        ? right.files.map(f => <Tag key={f}>{f}</Tag>)
        : "-",
    },
  ];

  return (
    <Card>
        <h2 className="compare-title">
  So sánh các phiên bản giáo trình
</h2>

      {/* ===== SELECT VERSION ===== */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <Select
          placeholder="Chọn phiên bản A"
          style={{ width: 240 }}
          onChange={setLeftId}
        >
          {mockVersions.map(v => (
            <Option key={v.id} value={v.id}>
              {v.version} - {v.created_at}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Chọn phiên bản B"
          style={{ width: 240 }}
          onChange={setRightId}
        >
          {mockVersions.map(v => (
            <Option key={v.id} value={v.id}>
              {v.version} - {v.created_at}
            </Option>
          ))}
        </Select>
      </div>

      {/* ===== TABLE COMPARE ===== */}
      <Table
        bordered
        pagination={false}
        columns={columns}
        dataSource={dataSource}
      />
    </Card>
  );
}
