import "./plo-management.css";

const PLOS = [
  {
    code: "PLO1",
    title: "Kiến thức cơ bản về lĩnh vực",
    group: "Knowledge",
    desc:
      "Người học nắm được nền tảng kiến thức cốt lõi của ngành/chuyên ngành, hiểu khái niệm và nguyên lý cơ bản.",
    status: "active",
    updatedAt: "2026-01-22",
  },
  {
    code: "PLO2",
    title: "Kỹ năng thực hành chuyên môn",
    group: "Skills",
    desc:
      "Người học áp dụng được kiến thức vào giải quyết bài toán thực tế, thực hiện thao tác chuyên môn và quy trình làm việc.",
    status: "active",
    updatedAt: "2026-01-22",
  },
  {
    code: "PLO3",
    title: "Thái độ nghề nghiệp và đạo đức",
    group: "Attitude",
    desc:
      "Người học thể hiện trách nhiệm nghề nghiệp, tuân thủ đạo đức, làm việc nhóm và giao tiếp hiệu quả trong môi trường học thuật.",
    status: "active",
    updatedAt: "2026-01-22",
  },
];

export default function PloReferencePage() {
  return (
    <div className="aaPloManagement">
      <h1 className="aaTitle">Chuẩn Đầu Ra PLO</h1>

      <div className="aaCard">
        <div className="aaPloCardHeader">
          <div className="aaPloCardHeaderTitle">Danh sách PLO</div>
        </div>

        <div className="aaPloCardContent">
          <div className="aaPloGrid">
            {PLOS.map((p) => (
              <div key={p.code} className="aaPloCard">
                <div className="aaPloHeader">
                  <div className="aaPloCode">{p.code}</div>
                  <div className="aaPloCardTitle">{p.title}</div>
                </div>

                <div className="aaPloTag">
                  <span className="aaTag">{p.group}</span>
                </div>

                <p className="aaPloDesc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
