import "./compare-syllabus.css";
import { useMemo, useState } from "react";

const SYLLABI = [
  {
    id: "web_2025_hk1",
    label: "Lập trình Web • HK1 2025",
    meta: { subject: "Lập trình Web", year: "2025-2026", semester: "Học kỳ 1", teacher: "Nguyễn Văn Chiến", updatedAt: "05/01/2026" },
    sections: {
      "Mục tiêu học tập": "Hiểu khái niệm cơ bản",
      "Nội dung": "5 chương",
      "CLO": "CLO1, CLO2",
      "Đánh giá": "Bài tập 30% • Thi 70%",
      "Tài liệu": "Giáo trình A",
    },
  },
  {
    id: "web_2024_hk1",
    label: "Lập trình Web • HK1 2024",
    meta: { subject: "Lập trình Web", year: "2024-2025", semester: "Học kỳ 1", teacher: "Nguyễn Văn Chiến", updatedAt: "06/01/2025" },
    sections: {
      "Mục tiêu học tập": "Hiểu khái niệm và áp dụng",
      "Nội dung": "6 chương",
      "CLO": "CLO1, CLO2, CLO3",
      "Đánh giá": "Bài tập 40% • Thi 60%",
      "Tài liệu": "Giáo trình A + tài liệu bổ sung",
    },
  },
  {
    id: "cnpm_2025_hk1",
    label: "Công nghệ phần mềm • HK1 2025",
    meta: { subject: "Công nghệ phần mềm", year: "2025-2026", semester: "Học kỳ 1", teacher: "Trần Thị B", updatedAt: "04/01/2026" },
    sections: {
      "Mục tiêu học tập": "Nắm quy trình phát triển",
      "Nội dung": "8 chương",
      "CLO": "CLO1, CLO2",
      "Đánh giá": "Project 50% • Thi 50%",
      "Tài liệu": "Giáo trình B",
    },
  },
];

function diffText(a, b) {
  if (a === b) return "";
  if (!a && b) return `Thêm "${b}"`;
  if (a && !b) return `Bỏ "${a}"`;
  return "Có thay đổi";
}

export default function CompareSyllabus() {
  const [id1, setId1] = useState("web_2025_hk1");
  const [id2, setId2] = useState("web_2024_hk1");
  const [onlyDiff, setOnlyDiff] = useState(true);

  const s1 = SYLLABI.find((x) => x.id === id1) || SYLLABI[0];
  const s2 = SYLLABI.find((x) => x.id === id2) || SYLLABI[1];

  const rows = useMemo(() => {
    const keys = Array.from(
      new Set([...Object.keys(s1.sections || {}), ...Object.keys(s2.sections || {})])
    );

    const all = keys.map((k) => {
      const a = s1.sections?.[k] ?? "";
      const b = s2.sections?.[k] ?? "";
      const changed = a !== b;
      return { key: k, a, b, changed, diff: diffText(a, b) };
    });

    return onlyDiff ? all.filter((r) => r.changed) : all;
  }, [s1, s2, onlyDiff]);

  const summary = useMemo(() => {
    const allKeys = Array.from(
      new Set([...Object.keys(s1.sections || {}), ...Object.keys(s2.sections || {})])
    );
    let changed = 0;
    for (const k of allKeys) {
      if ((s1.sections?.[k] ?? "") !== (s2.sections?.[k] ?? "")) changed += 1;
    }
    return { total: allKeys.length, changed };
  }, [s1, s2]);

  return (
    <div className="aaCompare">
      <div className="aaHead">
        <h1 className="aaTitle">So sánh giáo trình giữa các học kỳ</h1>
        <p className="aaSub">
          Chọn 2 giáo trình cùng môn để xem phần nào thay đổi (mục tiêu, nội dung, CLO, đánh giá, tài liệu…).
        </p>
      </div>

      {/* FILTER CARD */}
      <div className="aaCard">
        <div className="aaFilters">
          <div className="aaField">
            <label>Giáo trình 1</label>
            <select className="aaSelect" value={id1} onChange={(e) => setId1(e.target.value)}>
              {SYLLABI.map((x) => (
                <option key={x.id} value={x.id}>{x.label}</option>
              ))}
            </select>
          </div>

          <div className="aaField">
            <label>Giáo trình 2</label>
            <select className="aaSelect" value={id2} onChange={(e) => setId2(e.target.value)}>
              {SYLLABI.map((x) => (
                <option key={x.id} value={x.id}>{x.label}</option>
              ))}
            </select>
          </div>

          <div className="aaRight">
            <label className="aaCheck">
              <input
                type="checkbox"
                checked={onlyDiff}
                onChange={(e) => setOnlyDiff(e.target.checked)}
              />
              Chỉ hiện phần khác biệt
            </label>

            <div className="aaMiniKpi">
              <span className="aaPill">{summary.changed} thay đổi</span>
              <span className="aaPill aaPill--muted">{summary.total} mục</span>
            </div>
          </div>
        </div>

        {/* META */}
        <div className="aaMeta">
          <div className="aaMetaCard">
            <div className="aaMetaTop">Giáo trình 1</div>
            <div className="aaMetaMain">{s1.meta.subject}</div>
            <div className="aaMetaSub">
              {s1.meta.year} • {s1.meta.semester} • {s1.meta.teacher} • Cập nhật {s1.meta.updatedAt}
            </div>
          </div>

          <div className="aaMetaCard">
            <div className="aaMetaTop">Giáo trình 2</div>
            <div className="aaMetaMain">{s2.meta.subject}</div>
            <div className="aaMetaSub">
              {s2.meta.year} • {s2.meta.semester} • {s2.meta.teacher} • Cập nhật {s2.meta.updatedAt}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="aaTableWrapper">
          <table className="aaTable">
            <thead>
              <tr>
                <th style={{ width: 220 }}>Phần</th>
                <th>Giáo trình 1</th>
                <th>Giáo trình 2</th>
                <th style={{ width: 180 }}>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className={r.changed ? "isChanged" : ""}>
                  <td className="aaStrong">{r.key}</td>
                  <td>{r.a || <em>—</em>}</td>
                  <td>{r.b || <em>—</em>}</td>
                  <td>
                    {r.changed ? (
                      <span className="aaBadge aaBadge--changed">Có thay đổi</span>
                    ) : (
                      <span className="aaBadge aaBadge--same">Giống nhau</span>
                    )}
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="aaEmpty">
                    <div className="aaEmptyTitle">Không có khác biệt</div>
                    <div className="aaEmptySub">Thử tắt “Chỉ hiện phần khác biệt” để xem toàn bộ.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        
      </div>
    </div>
  );
}
