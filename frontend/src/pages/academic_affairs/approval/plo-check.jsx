import "./plo-check.css";
import { useState } from "react";

const initialRows = [
  {
    subject: "Lập trình Web",
    clo: "CLO1: Hiểu khái niệm lập trình",
    plo: "PLO1: Kiến thức cơ bản",
    status: { label: "Phù hợp", tone: "ok" },
  },
  {
    subject: "Công nghệ phần mềm",
    clo: "CLO2: Áp dụng quy trình phát triển",
    plo: "PLO2: Kỹ năng thực hành",
    status: { label: "Cần điều chỉnh", tone: "warn" },
  },
];

export default function PloCheck() {
  const [rows, setRows] = useState(initialRows);
  const [statusFilter, setStatusFilter] = useState("");

  const toggleStatus = (index) => {
    setRows((prevRows) =>
      prevRows.map((row, i) =>
        i === index
          ? {
              ...row,
              status: row.status.tone === "ok"
                ? { label: "Cần điều chỉnh", tone: "warn" }
                : { label: "Phù hợp", tone: "ok" },
            }
          : row
      )
    );
  };

  const filteredRows = statusFilter
    ? rows.filter((r) => r.status.tone === statusFilter)
    : rows;
  return (
    <div className="aaPloCheck">
      {/* Header */}
      <h1 className="aaTitle">Kiểm tra sự phù hợp với PLO</h1>

      {/* Table card */}
      <div className="aaCard">
        <div className="aaCardHeader">
          <div className="aaSearch">
            <input
              className="aaInput"
              placeholder="Tìm theo môn / CLO / PLO..."
              aria-label="Tìm kiếm"
            />
          </div>

          <div className="aaFilterGroup">
            <label>Mức độ phù hợp</label>
            <select
              className="aaSelect"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="ok">Phù hợp</option>
              <option value="warn">Cần điều chỉnh</option>
            </select>
          </div>
        </div>

        <div className="aaTableWrapper">
          <table className="aaTable">
            <thead>
              <tr>
                <th style={{ width: 260 }}>Môn học</th>
                <th>CLO</th>
                <th>PLO liên kết</th>
                <th style={{ width: 180 }}>Mức độ phù hợp</th>
                <th style={{ width: 160, textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((r, idx) => (
                <tr key={idx}>
                  <td className="aaTableStrong">{r.subject}</td>
                  <td>{r.clo}</td>
                  <td>{r.plo}</td>
                  <td>
                    <span
                      className={`aaStatus aaStatus--${r.status.tone} aaStatus--clickable`}
                      onClick={() => toggleStatus(idx)}
                    >
                      {r.status.label}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="aaLinkBtn" type="button">
                      Xem chi tiết →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
      </div>
    </div>
  );
}
