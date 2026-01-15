import { useEffect, useState } from "react";
import { API_BASE } from "../../../services/api";
import { useNavigate } from "react-router-dom";

export default function SyllabusList() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/syllabus`)
      .then(res => res.json())
      .then(setList);
  }, []);

  return (
    <div className="user-page">
      <h2 className="user-page-title">Danh sách giáo trình học phần</h2>

      <div className="user-table-card">
        <table className="uth-table">
          <thead>
            <tr>
              <th className="col-stt">STT</th>
              <th>Mã học phần</th>
              <th>Tên học phần</th>
              <th>Số tín chỉ</th>
              <th>Giáo trình</th>
            </tr>
          </thead>

          <tbody>
            {list.map((s, index) => (
              <tr key={s.syllabus_id}>
                <td className="col-stt">{index + 1}</td>
                <td>{s.course_code}</td>
                <td>{s.course_name}</td>
                <td>{s.credits}</td>
                <td>
                  <button
                    className="action-btn"
                    onClick={() =>
                      navigate(`/admin/syllabus/${s.syllabus_id}`)
                    }
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}

            {list.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
                  Chưa có giáo trình
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
