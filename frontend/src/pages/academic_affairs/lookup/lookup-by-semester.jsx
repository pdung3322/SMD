import "./lookup-by-semester.css";
import { useMemo, useState } from "react";

const STATUS = {
  approved: { label: "Đã duyệt", tone: "approved" },
  pending: { label: "Chờ duyệt", tone: "pending" },
  rejected: { label: "Bị từ chối", tone: "rejected" },
};

// demo data (sau này backend trả về)
const DATA = [
  {
    id: "sy_001",
    year: "2025-2026",
    semester: "Học kỳ 1",
    subject: "Lập trình Web",
    teacher: "Nguyễn Văn Chiến",
    status: "approved",
    updatedAt: "05/01/2026",
  },
  {
    id: "sy_002",
    year: "2025-2026",
    semester: "Học kỳ 1",
    subject: "Công nghệ phần mềm",
    teacher: "Trần Thị B",
    status: "approved",
    updatedAt: "04/01/2026",
  },
  {
    id: "sy_003",
    year: "2025-2026",
    semester: "Học kỳ 1",
    subject: "Cơ sở dữ liệu",
    teacher: "Lê Minh K",
    status: "pending",
    updatedAt: "03/01/2026",
  },
  {
    id: "sy_004",
    year: "2025-2026",
    semester: "Học kỳ 1",
    subject: "Mạng máy tính",
    teacher: "Phạm Anh T",
    status: "rejected",
    updatedAt: "02/01/2026",
  },
  {
    id: "sy_005",
    year: "2024-2025",
    semester: "Học kỳ 2",
    subject: "Lập trình Web",
    teacher: "Nguyễn Văn Chiến",
    status: "approved",
    updatedAt: "10/06/2025",
  },
];

export default function LookupBySemester() {
  const [year, setYear] = useState("2025-2026");
  const [semester, setSemester] = useState("Học kỳ 1");
  const [statusFilter, setStatusFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("updated_desc");

  // “Tìm kiếm” kiểu đúng UX: filter thực thi ngay (không cần nút),
  // nhưng mình vẫn giữ nút để bạn demo nghiệp vụ.
  const [submitted, setSubmitted] = useState({
    year: "2025-2026",
    semester: "Học kỳ 1",
    statusFilter: "",
    keyword: "",
    sort: "updated_desc",
  });

  const onSearch = () => {
    setSubmitted({ year, semester, statusFilter, keyword, sort });
  };

  const onReset = () => {
    setYear("2025-2026");
    setSemester("Học kỳ 1");
    setStatusFilter("");
    setKeyword("");
    setSort("updated_desc");
    setSubmitted({
      year: "2025-2026",
      semester: "Học kỳ 1",
      statusFilter: "",
      keyword: "",
      sort: "updated_desc",
    });
  };

  const results = useMemo(() => {
    const q = submitted.keyword.trim().toLowerCase();

    let rows = DATA.filter((x) => {
      const matchYear = x.year === submitted.year;
      const matchSemester = x.semester === submitted.semester;
      const matchStatus = submitted.statusFilter ? x.status === submitted.statusFilter : true;

      const matchKeyword = q
        ? [x.subject, x.teacher].some((t) => String(t).toLowerCase().includes(q))
        : true;

      return matchYear && matchSemester && matchStatus && matchKeyword;
    });

    // sort
    rows = [...rows].sort((a, b) => {
      // dd/mm/yyyy -> yyyy-mm-dd để so
      const parseVN = (s) => {
        const [dd, mm, yyyy] = String(s).split("/");
        return `${yyyy}-${mm}-${dd}`;
      };
      const da = parseVN(a.updatedAt);
      const db = parseVN(b.updatedAt);

      if (submitted.sort === "updated_asc") return da.localeCompare(db);
      if (submitted.sort === "subject_asc") return a.subject.localeCompare(b.subject);
      if (submitted.sort === "subject_desc") return b.subject.localeCompare(a.subject);
      return db.localeCompare(da); // updated_desc default
    });

    return rows;
  }, [submitted]);

  const summary = useMemo(() => {
    const total = results.length;
    const approved = results.filter((r) => r.status === "approved").length;
    const pending = results.filter((r) => r.status === "pending").length;
    const rejected = results.filter((r) => r.status === "rejected").length;
    return { total, approved, pending, rejected };
  }, [results]);

  return (
    <div className="aaLookup">
      <div className="aaHead">
        <h1 className="aaTitle">Tra cứu giáo trình theo năm học và học kỳ</h1>
        <p className="aaSub">
          Chọn <b>năm học</b>, <b>học kỳ</b> để xem danh sách giáo trình đã nộp và trạng thái xử lý.
        </p>
      </div>

      {/* FILTER CARD */}
      <div className="aaCard">
        <div className="aaFilters">
          <div className="aaField">
            <label>Năm học</label>
            <select className="aaSelect" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="2025-2026">2025-2026</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </div>

          <div className="aaField">
            <label>Học kỳ</label>
            <select
              className="aaSelect"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="Học kỳ 1">Học kỳ 1</option>
              <option value="Học kỳ 2">Học kỳ 2</option>
            </select>
          </div>

          <div className="aaField">
            <label>Trạng thái</label>
            <select
              className="aaSelect"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="approved">Đã duyệt</option>
              <option value="pending">Chờ duyệt</option>
              <option value="rejected">Bị từ chối</option>
            </select>
          </div>

          <div className="aaField aaField--grow">
            <label>Tìm nhanh</label>
            <input
              className="aaInput"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Nhập tên môn hoặc giảng viên..."
            />
          </div>

          <div className="aaField">
            <label>Sắp xếp</label>
            <select className="aaSelect" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="updated_desc">Mới cập nhật (↓)</option>
              <option value="updated_asc">Cũ nhất (↑)</option>
              <option value="subject_asc">Môn học (A→Z)</option>
              <option value="subject_desc">Môn học (Z→A)</option>
            </select>
          </div>

          <div className="aaActions">
            <button className="aaBtn aaBtn--ghost" type="button" onClick={onReset}>
              Đặt lại
            </button>
            <button className="aaBtn aaBtn--primary" type="button" onClick={onSearch}>
              Tìm kiếm
            </button>
          </div>
        </div>

        

        {/* TABLE */}
        <div className="aaTableWrapper">
          <table className="aaTable">
            <thead>
              <tr>
                <th style={{ width: 60 }}>STT</th>
                <th>Môn học</th>
                <th>Giảng viên</th>
                <th>Trạng thái</th>
                <th>Ngày cập nhật</th>
              </tr>
            </thead>

            <tbody>
              {results.map((r, index) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{index + 1}</td>
                  <td className="aaCourseName">{r.subject}</td>
                  <td>{r.teacher}</td>
                  <td>
                    <span className={`aaBadge aaBadge--${STATUS[r.status].tone}`}>
                      {STATUS[r.status].label}
                    </span>
                  </td>
                  <td>{r.updatedAt}</td>
                </tr>
              ))}

              {results.length === 0 && (
                <tr>
                  <td colSpan={5} className="aaEmpty">
                    <div className="aaEmptyTitle">Không có dữ liệu</div>
                    <div className="aaEmptySub">
                      Thử đổi năm học / học kỳ / trạng thái hoặc từ khóa tìm kiếm.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="aaFoot">
          Đang xem: <b>{submitted.year}</b> • <b>{submitted.semester}</b>
        </div>
      </div>
    </div>
  );
}
