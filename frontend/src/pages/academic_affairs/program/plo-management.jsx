import "./plo-management.css";
import { ploMasterData } from "../../../mockData/academicAffairsMockData";

// Convert objectdata to array for display
const PLOS = Object.values(ploMasterData).map((plo) => ({
  code: plo.code,
  title: plo.title,
  group: plo.group,
  desc: plo.description,
  status: plo.status,
  updatedAt: plo.updatedAt,
}));

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
