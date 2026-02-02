import { useEffect, useState } from "react";
import "./academic-list.css";
import api from "../../../services/api";

export default function SemesterList() {
  const [years, setYears] = useState([]);
  const [academicYearId, setAcademicYearId] = useState(null);
  const [semesters, setSemesters] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);

  const [form, setForm] = useState({
    code: "",
    name: "",
    start_date: "",
    end_date: "",
    is_optional: false,
  });

  // ======================
  // LOAD ACADEMIC YEARS
  // ======================
  useEffect(() => {
    api.get("/academic/academic-years").then((res) => {
      setYears(res.data);

      const activeYear = res.data.find((y) => y.is_active);
      if (activeYear) {
        setAcademicYearId(activeYear.id);
      }
    });
  }, []);

  // ======================
  // LOAD SEMESTERS
  // ======================
  useEffect(() => {
    if (!academicYearId) return;

    api
      .get(`/academic/semesters?academic_year_id=${academicYearId}`)
      .then((res) => setSemesters(res.data));
  }, [academicYearId]);

  // ======================
  // CRUD HANDLERS
  // ======================
  const openCreate = () => {
    setEditingSemester(null);
    setForm({
      code: "",
      name: "",
      start_date: "",
      end_date: "",
      is_optional: false,
    });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditingSemester(s);
    setForm({
      code: s.code,
      name: s.name,
      start_date: s.start_date,
      end_date: s.end_date,
      is_optional: s.is_optional,
    });
    setShowModal(true);
  };

  const submitForm = async () => {
    try {
      if (editingSemester) {
        await api.put(
          `/academic/semesters/${editingSemester.id}`,
          form
        );
      } else {
        await api.post("/academic/semesters", {
          ...form,
          academic_year_id: academicYearId,
        });
      }
      setShowModal(false);

      const res = await api.get(
        `/academic/semesters?academic_year_id=${academicYearId}`
      );
      setSemesters(res.data);
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi thao tác");
    }
  };

  const deleteSemester = async (id) => {
    if (!window.confirm("Xóa học kỳ này?")) return;
    await api.delete(`/academic/semesters/${id}`);

    const res = await api.get(
      `/academic/semesters?academic_year_id=${academicYearId}`
    );
    setSemesters(res.data);
  };

  const setCurrentSemester = async (id) => {
    if (!window.confirm("Đặt học kỳ này làm hiện hành?")) return;
    await api.patch(`/academic/semesters/${id}/set-current`);

    const res = await api.get(
      `/academic/semesters?academic_year_id=${academicYearId}`
    );
    setSemesters(res.data);
  };

  return (
    <div className="academic-page">
      <div className="page-header">
        <h1 className="page-title">Danh sách học kỳ</h1>

        <div style={{ display: "flex", gap: 12 }}>
          <select
            value={academicYearId || ""}
            onChange={(e) =>
              setAcademicYearId(Number(e.target.value))
            }
          >
            {years.map((y) => (
              <option key={y.id} value={y.id}>
                {y.name}
              </option>
            ))}
          </select>

          <button className="btn-primary" onClick={openCreate}>
            + Thêm học kỳ
          </button>
        </div>
      </div>

      <table className="academic-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã</th>
            <th>Học kỳ</th>
            <th>Thời gian</th>
            <th>Tính chất</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {semesters.map((s, index) => {
  let statusText = "Không hiện hành";
  let statusClass = "finished";

  if (s.is_current) {
    statusText = "Học kỳ hiện hành";
    statusClass = "active";
  }

  return (
    <tr key={s.id}>
      <td>{index + 1}</td>
      <td>{s.code}</td>
      <td>{s.name}</td>
      <td>
        {s.start_date} – {s.end_date}
      </td>
      <td>
        {s.is_optional ? "Không bắt buộc" : "Bắt buộc"}
      </td>
      <td className={`academic-status ${statusClass}`}>
        {statusText}
      </td>
      <td className="actions">
        <button onClick={() => openEdit(s)}>Sửa</button>

        {!s.is_current && (
          <button onClick={() => setCurrentSemester(s.id)}>
            Set hiện hành
          </button>
        )}

        <button
          className="danger"
          onClick={() => deleteSemester(s.id)}
        >
          Xóa
        </button>
      </td>
    </tr>
  );
})}

        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>
              {editingSemester ? "Sửa học kỳ" : "Thêm học kỳ"}
            </h3>

            <input
              placeholder="Mã học kỳ (HK1, HK2, HK_HE)"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value })
              }
            />
            
            <input
              placeholder="Tên học kỳ"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <div className="form-row">
            <input
              type="date"
              value={form.start_date}
              onChange={(e) =>
                setForm({ ...form, start_date: e.target.value })
              }
            />

            <input
              type="date"
              value={form.end_date}
              onChange={(e) =>
                setForm({ ...form, end_date: e.target.value })
              }
            />
            </div>
            <label>
              <input
                type="checkbox"
                checked={form.is_optional}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_optional: e.target.checked,
                  })
                }
              />
              Học kỳ không bắt buộc
            </label>

            <div className="modal-actions">
              <button onClick={submitForm}>Lưu</button>
              <button onClick={() => setShowModal(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
