import { useEffect, useState } from "react";
import "./academic-list.css";
import api from "../../../services/api";

export default function AcademicYearList() {
  const [years, setYears] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingYear, setEditingYear] = useState(null);

  const [form, setForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    const res = await api.get("/academic/academic-years");
    setYears(res.data);
  };

  // ======================
  // CRUD HANDLERS
  // ======================
  const openCreate = () => {
    setEditingYear(null);
    setForm({ name: "", start_date: "", end_date: "" });
    setShowModal(true);
  };

  const openEdit = (year) => {
    setEditingYear(year);
    setForm({
      name: year.name,
      start_date: year.start_date,
      end_date: year.end_date,
    });
    setShowModal(true);
  };

  const submitForm = async () => {
    try {
      if (editingYear) {
        await api.put(
          `/academic/academic-years/${editingYear.id}`,
          form
        );
      } else {
        await api.post("/academic/academic-years", form);
      }
      setShowModal(false);
      fetchYears();
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi thao tác");
    }
  };

  const activateYear = async (id) => {
    if (!window.confirm("Kích hoạt năm học này?")) return;
    await api.patch(`/academic/academic-years/${id}/activate`);
    fetchYears();
  };

  const closeYear = async (id) => {
    if (!window.confirm("Đóng năm học này?")) return;
    await api.patch(`/academic/academic-years/${id}/close`);
    fetchYears();
  };

  const deleteYear = async (id) => {
    if (!window.confirm("Xóa năm học này?")) return;
    await api.delete(`/academic/academic-years/${id}`);
    fetchYears();
  };

  return (
    <div className="academic-page">
      <div className="page-header">
        <h1 className="page-title">Danh sách năm học</h1>
        <button className="btn-primary" onClick={openCreate}>
          + Thêm năm học
        </button>
      </div>

      <table className="academic-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Năm học</th>
            <th>Bắt đầu</th>
            <th>Kết thúc</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {years.map((y, index) => {
            let statusText = "Ngoài thời gian";
            let statusClass = "finished";

            if (y.is_active && !y.is_closed) {
              statusText = "Đang áp dụng";
              statusClass = "active";
            }
            if (y.is_closed) {
              statusText = "Đã đóng";
              statusClass = "closed";
            }

            return (
              <tr key={y.id}>
                <td>{index + 1}</td>
                <td className="year-name">{y.name}</td>
                <td>{y.start_date}</td>
                <td>{y.end_date}</td>
                <td className={`academic-status ${statusClass}`}>
                  {statusText}
                </td>
                <td className="actions">
                  <button onClick={() => openEdit(y)}>Sửa</button>
                  {!y.is_closed && (
                    <>
                      <button onClick={() => activateYear(y.id)}>
                        Kích hoạt
                      </button>
                      <button onClick={() => closeYear(y.id)}>
                        Đóng
                      </button>
                    </>
                  )}
                  <button
                    className="danger"
                    onClick={() => deleteYear(y.id)}
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
          <div className="modal modal-center">
            <h3>
              {editingYear ? "Sửa năm học" : "Thêm năm học"}
            </h3>

            <div className="modal-form">
              <input
                className="input-center"
                placeholder="Tên năm học (vd: 2025-2026)"
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

              <div className="modal-actions center">
                <button className="btn-primary" onClick={submitForm}>
                  Lưu
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
