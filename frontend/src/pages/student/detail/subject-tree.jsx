import React from "react";
import "./subject-tree.css";

const SubjectTree = () => {
  // Demo data (bạn thay bằng API sau)
  const semesters = [
    {
      title: "Học kỳ 1",
      totalCredits: 14,
      groups: [
        {
          title: "Học phần bắt buộc",
          groupTotalCredits: 14,
          rows: [
            {
              name: "Xác suất thống kê và xử lý số liệu thực nghiệm",
              code: "0104001215",
              condition: "",
              credits: 3,
              electiveGroup: 0,
              requiredInGroup: 0,
              passed: true,
              note: "",
            },
            {
              name: "Pháp luật đại cương",
              code: "0104005004",
              condition: "",
              credits: 2,
              electiveGroup: 0,
              requiredInGroup: 0,
              passed: true,
              note: "",
            },
            {
              name: "Triết học Mác - Lênin",
              code: "0104005105",
              condition: "",
              credits: 3,
              electiveGroup: 0,
              requiredInGroup: 0,
              passed: true,
              note: "",
            },
            {
              name: "Đường lối quốc phòng và an ninh của đảng cộng sản VN",
              code: "0104007201",
              condition: "",
              credits: 3,
              electiveGroup: 0,
              requiredInGroup: 0,
              passed: true,
              note: "(*)",
            },
            {
              name: "Công tác quốc phòng và an ninh",
              code: "0104007202",
              condition: "",
              credits: 2,
              electiveGroup: 0,
              requiredInGroup: 0,
              passed: true,
              note: "(*)",
            },
          ],
        },
      ],
    },
    {
      title: "Học kỳ 2",
      totalCredits: 15,
      groups: [
        {
          title: "Học phần bắt buộc",
          groupTotalCredits: 15,
          rows: [
            {
              name: "Kinh tế chính trị Mác - Lênin",
              code: "0104005106",
              condition: "005105(a)",
              credits: 2,
              electiveGroup: 0,
              requiredInGroup: 0,
              passed: false,
              note: "",
            },
            {
              name: "Cơ sở dữ liệu",
              code: "0104121000",
              condition: "",
              credits: 3,
              electiveGroup: 0,
              requiredInGroup: 0,
              passed: true,
              note: "",
            },
            {
              name: "Quản trị doanh nghiệp CNTT",
              code: "0104121137",
              condition: "",
              credits: 3,
              electiveGroup: 0,
              requiredInGroup: 0,
              passed: true,
              note: "",
            },
            {
              name: "Mạng máy tính",
              code: "0104123002",
              condition: "",
              credits: 3,
              electiveGroup: 0,
              requiredInGroup: 0,
              passed: true,
              note: "",
            },
            {
              name: "Kỹ thuật lập trình",
              code: "0104124101",
              condition: "",
              credits: 4,
              electiveGroup: 0,
              requiredInGroup: 0,
              passed: true,
              note: "",
            },
          ],
        },
      ],
    },
  ];

  const columns = [
    { key: "name", label: "Tên học phần" },
    { key: "code", label: "Mã học phần" },
    { key: "condition", label: "Điều kiện đăng ký" },
    { key: "credits", label: "Số TC" },
    { key: "electiveGroup", label: "Nhóm tự chọn" },
    { key: "requiredInGroup", label: "Số TC bắt buộc của nhóm" },
    { key: "passed", label: "Đạt" },
  ];

  return (
    <div className="st-page">
      <div className="st-card">
        <div className="st-tableWrap">
          <table className="st-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {semesters.map((sem, semIdx) => (
                <React.Fragment key={semIdx}>
                  {/* Semester row */}
                  <tr className="st-semRow">
                    <td className="st-semTitle" colSpan={3}>
                      {sem.title}
                    </td>
                    <td className="st-totalCredit">{sem.totalCredits}</td>
                    <td colSpan={3} />
                  </tr>

                  {sem.groups.map((g, gIdx) => (
                    <React.Fragment key={gIdx}>
                      {/* Group row */}
                      <tr className="st-groupRow">
                        <td className="st-groupTitle" colSpan={3}>
                          {g.title}
                        </td>
                        <td className="st-totalCredit">{g.groupTotalCredits}</td>
                        <td colSpan={3} />
                      </tr>

                      {/* Data rows */}
                      {g.rows.map((r, rIdx) => (
                        <tr className="st-dataRow" key={rIdx}>
                          <td className="st-nameCell">
                            <span className="st-nameText">{r.name}</span>
                            {r.note ? <span className="st-note">{r.note}</span> : null}
                          </td>
                          <td className="st-center">{r.code}</td>
                          <td className={`st-center ${r.condition ? "st-condition" : ""}`}>
                            {r.condition}
                          </td>
                          <td className="st-center">{r.credits}</td>
                          <td className="st-center">{r.electiveGroup}</td>
                          <td className="st-center">{r.requiredInGroup}</td>
                          <td className="st-center">
                            {r.passed ? <span className="st-check" /> : null}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <div className="st-footnote">
          <div className="st-footnoteTitle">Ghi chú:</div>
          <div>Những môn học có dấu <b>*</b> không được tính vào Trung bình chung tích lũy</div>
          <div>(a): Học phần học trước</div>
          <div>(b): Học phần tiên quyết</div>
          <div>(c): Học phần song hành</div>
        </div>
      </div>
    </div>
  );
};

export default SubjectTree;
