const INITIAL_SYLLABI = [
  {
    id: "sy_001",
    subject: "Lập trình Web",
    teacher: "Trần Thị B",
    submittedAt: "02/01/2026",
    approvalStatus: "pending",
    clo: "CLO1: Hiểu khái niệm lập trình web cơ bản",
    plo: "PLO1: Kiến thức cơ bản",
    mappingStatus: null,
    note: "",
    lastReviewedAt: null,
    approvedAt: null,
  },
  {
    id: "sy_002",
    subject: "Cơ sở dữ liệu",
    teacher: "Lê Văn C",
    submittedAt: "03/01/2026",
    approvalStatus: "pending",
    clo: "CLO2: Áp dụng mô hình dữ liệu quan hệ",
    plo: "PLO2: Kỹ năng thực hành",
    mappingStatus: null,
    note: "CLO còn chung chung, thiếu tiêu chí đo lường.",
    lastReviewedAt: null,
    approvedAt: null,
  },
];

let store = [...INITIAL_SYLLABI];

function loadStore() {
  return store.map((row) => ({ ...row }));
}

function saveStore(next) {
  store = next.map((row) => ({ ...row }));
  return loadStore();
}

export function getSyllabi() {
  return loadStore();
}

export function setSyllabi(next) {
  return saveStore(next);
}

export function updateSyllabus(id, patch) {
  const current = loadStore();
  const next = current.map((row) => (row.id === id ? { ...row, ...patch } : row));
  return saveStore(next);
}
