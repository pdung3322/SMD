import "./plo-check.css";
;

import { useMemo, useState } from "react";

/**
 * STATUS: kết luận hiển thị (AA có thể sửa thủ công)
 * AUTO/MANUAL: nguồn kết luận (để demo "tự động hoá + người duyệt")
 */
const STATUS = {
  OK: { label: "Phù hợp", tone: "ok" },
  WARN: { label: "Cần điều chỉnh", tone: "warn" },
  BAD: { label: "Không phù hợp", tone: "bad" },
};

// === 1) Bộ PLO chuẩn (nguồn tham chiếu) ===
// Thực tế PLO này lấy từ trang "Chuẩn đầu ra PLO" / DB, ở demo mình hard-code.
const PLO_MASTER = {
  PLO1: {
    code: "PLO1",
    category: "knowledge",
    keywords: ["khái niệm", "lý thuyết", "cơ bản", "nguyên lý", "kiến thức"],
  },
  PLO2: {
    code: "PLO2",
    category: "skills",
    keywords: ["áp dụng", "thực hành", "thiết kế", "triển khai", "xây dựng", "lập trình"],
  },
  PLO3: {
    code: "PLO3",
    category: "attitude",
    keywords: ["đạo đức", "trách nhiệm", "thái độ", "tuân thủ", "kỷ luật"],
  },
};

// động từ đo lường (rule đơn giản)
const ACTION_VERBS = ["hiểu", "áp dụng", "thiết kế", "phân tích", "xây dựng", "triển khai", "đánh giá", "thực hành"];

function normalize(s) {
  return String(s || "").toLowerCase();
}

function extractPloCode(ploText) {
  const m = String(ploText || "").match(/PLO\d+/i);
  return m ? m[0].toUpperCase() : null;
}

// === 2) Hàm tự động hoá đánh giá ===
// Đây là "auto-check": dựa vào PLO_MASTER + rule đơn giản.

function autoEvaluate(row) {
  const ploCode = extractPloCode(row.plo);

  // BAD: PLO không tồn tại trong bộ chuẩn
  if (!ploCode || !PLO_MASTER[ploCode]) {
    return {
      status: STATUS.BAD,
      note: "Tự động: PLO không tồn tại trong bộ chuẩn của chương trình.",
    };
  }

  const cloText = normalize(row.clo);

  // WARN: CLO thiếu động từ đo lường
  const hasVerb = ACTION_VERBS.some((v) => cloText.includes(v));
  if (!hasVerb) {
    return {
      status: STATUS.WARN,
      note: "Tự động: CLO thiếu động từ đo lường (hiểu/áp dụng/thiết kế/...).",
    };
  }

  // OK/WARN: dựa keyword của PLO
  const { keywords } = PLO_MASTER[ploCode];
  const hits = keywords.filter((k) => cloText.includes(normalize(k)));

  if (hits.length >= 1) {
    return {
      status: STATUS.OK,
      note: `Tự động: CLO khớp từ khoá PLO (${hits.join(", ")}).`,
    };
  }

  return {
    status: STATUS.WARN,
    note: "Tự động: chưa thấy từ khoá phù hợp với nhóm PLO → cần AA xem lại mapping.",
  };
}

// Demo data (CLO/PLO mapping của các syllabus)
const initialRows = [
  {
    id: "map_001",
    subject: "Lập trình Web",
    lecturer: "ThS. Nguyễn Văn A",
    submittedAt: "2024-01-15",
    clo: "CLO1: Hiểu khái niệm lập trình web cơ bản",
    plo: "PLO1: Kiến thức cơ bản",
    status: STATUS.OK,
    note: "",
    
    lastReviewedAt: null,
  },
  {
    id: "map_002",
    subject: "Công nghệ phần mềm",
    lecturer: "TS. Trần Thị B",
    submittedAt: "2024-01-18",
    clo: "CLO2: Áp dụng quy trình phát triển phần mềm",
    plo: "PLO2: Kỹ năng thực hành",
    status: STATUS.WARN,
    note: "CLO mô tả chung, cần gắn rubric/đánh giá rõ hơn.",
    
    lastReviewedAt: null,
  },
  {
    id: "map_003",
    subject: "Đạo đức nghề nghiệp",
    lecturer: "PGS. Phạm Văn C",
    submittedAt: "2024-01-20",
    clo: "CLO1: Tuân thủ nguyên tắc đạo đức trong môi trường làm việc",
    plo: "PLO3: Thái độ & đạo đức",
    status: STATUS.OK,
    note: "",
 
    lastReviewedAt: null,
  },
  {
    id: "map_004",
    subject: "Cấu trúc dữ liệu",
    lecturer: "TS. Lê Văn D",
    submittedAt: "2024-01-22",
    clo: "CLO1: Nắm được nội dung môn học",
    plo: "PLO2: Kỹ năng thực hành",
    status: STATUS.WARN,
    note: "",
    
    lastReviewedAt: null,
  },
];

export default function PloCheck() {
  const [rows, setRows] = useState(initialRows);
  const [statusFilter, setStatusFilter] = useState("");
  const [query, setQuery] = useState("");

  // Modal state
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const editingRow = rows.find((r) => r.id === editingId) || null;

  // form state trong modal
  const [draftStatus, setDraftStatus] = useState("OK");
  const [draftNote, setDraftNote] = useState("");

  // === 3) Nút "Tự động kiểm tra" ===
  const runAutoCheck = () => {
    setRows((prev) =>
      prev.map((r) => {
        const auto = autoEvaluate(r);
        return {
          ...r,
          status: auto.status,
          // nếu AA đã ghi note thì giữ note; còn trống thì dùng auto note
          note: r.note?.trim() ? r.note : auto.note,
          
          lastReviewedAt: new Date().toISOString(),
        };
      })
    );
  };

  const openDetail = (row) => {
    setEditingId(row.id);
    setDraftStatus(
      row.status.tone === "ok" ? "OK" : row.status.tone === "warn" ? "WARN" : "BAD"
    );
    setDraftNote(row.note || "");
    setOpen(true);
  };

  const closeDetail = () => {
    setOpen(false);
    setEditingId(null);
  };

  const saveReview = () => {
    if (!editingRow) return;

    // Nếu chọn WARN/BAD thì bắt buộc ghi note -> logic nghiệp vụ cơ bản
    if ((draftStatus === "WARN" || draftStatus === "BAD") && draftNote.trim().length < 5) {
      alert("Vui lòng nhập nhận xét (ít nhất 5 ký tự) khi không đánh giá 'Phù hợp'.");
      return;
    }

    const nextStatus =
      draftStatus === "OK" ? STATUS.OK : draftStatus === "WARN" ? STATUS.WARN : STATUS.BAD;

    setRows((prev) =>
      prev.map((r) =>
        r.id === editingRow.id
          ? {
              ...r,
              status: nextStatus,
              note: draftNote.trim(),
              
              lastReviewedAt: new Date().toISOString(),
            }
          : r
      )
    );

    closeDetail();
  };

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return rows.filter((r) => {
      const matchStatus = statusFilter ? r.status.tone === statusFilter : true;
      const matchQuery = q
        ? [r.subject, r.clo, r.plo, r.note]
            .filter(Boolean)
            .some((x) => x.toLowerCase().includes(q))
        : true;
      return matchStatus && matchQuery;
    });
  }, [rows, statusFilter, query]);

  return (
    <div className="aaPloCheck">
      <h1 className="aaTitle">Kiểm tra CLO – PLO </h1>

      <div className="aaCard">
        <div className="aaCardHeader">
          <div className="aaSearch">
            <label className="aaSearchLabel">Tìm kiếm</label>
            <div className="aaSearchInputGroup">
              <input
                className="aaInput"
                placeholder="Tìm theo môn / CLO / PLO / nhận xét..."
                aria-label="Tìm kiếm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="aaBtn" type="button" onClick={runAutoCheck}>
                Tự động kiểm tra
              </button>
            </div>
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
              <option value="bad">Không phù hợp</option>
            </select>
          </div>
        </div>

        <div className="aaTableWrapper">
          <table className="aaTable">
            <thead>
              <tr>
                <th style={{ width: 60 }}>STT</th>
                <th style={{ width: 200 }}>Môn học</th>
                <th style={{ width: 180 }}>Giảng viên</th>
                <th style={{ width: 140 }}>Ngày gửi</th>
                <th style={{ width: 150 }}>Trạng thái</th>
                <th style={{ width: 150, textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((r, index) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{index + 1}</td>
                  <td className="aaTableStrong">{r.subject}</td>
                  <td>{r.lecturer}</td>
                  <td>{r.submittedAt}</td>
                  <td>
                    <span className={`aaStatus aaStatus--${r.status.tone}`}>
                      {r.status.label}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="aaLinkBtn" type="button" onClick={() => openDetail(r)}>
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 16 }}>
                    <em>Không có dữ liệu phù hợp.</em>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && editingRow && (
        <div className="aaModalBackdrop" role="dialog" aria-modal="true">
          <div className="aaModal">
            <div className="aaModalHeader">
              <h2 style={{ margin: 0, fontSize: 18 }}>Chi tiết kiểm tra CLO ↔ PLO</h2>
            </div>

            <div className="aaModalBody">
              <div className="aaField">
                <div className="aaLabel">Môn học</div>
                <div>{editingRow.subject}</div>
              </div>

              <div className="aaField">
                <div className="aaLabel">CLO</div>
                <div>{editingRow.clo}</div>
              </div>

              <div className="aaField">
                <div className="aaLabel">PLO liên kết</div>
                <div>{editingRow.plo}</div>
              </div>

              <div className="aaField">
                <div className="aaLabel">Đánh giá (AA duyệt)</div>
                <select
                  className="aaSelect"
                  value={draftStatus}
                  onChange={(e) => setDraftStatus(e.target.value)}
                >
                  <option value="OK">Phù hợp</option>
                  <option value="WARN">Cần điều chỉnh</option>
                  <option value="BAD">Không phù hợp</option>
                </select>
              </div>

              <div className="aaField">
                <div className="aaLabel">Nhận xét (bắt buộc nếu không “Phù hợp”)</div>
                <textarea
                  className="aaTextarea"
                  rows={4}
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  placeholder="Ví dụ: CLO chưa đo lường được, thiếu rubric, mapping PLO chưa đúng..."
                />
              </div>
            </div>

            <div className="aaModalFooter">
              <button className="aaBtn aaBtn--ghost" onClick={closeDetail}>
                Hủy
              </button>
              <button className="aaBtn" onClick={saveReview}>
                Lưu đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
