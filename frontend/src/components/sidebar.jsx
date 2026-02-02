import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/sidebar.css";
import { SIDEBAR_BY_ROLE } from "../services/sidebar-data";
import { getCurrentSemester } from "../services/academic";

export default function Sidebar({ collapsed, role }) {
  const roleData = SIDEBAR_BY_ROLE[role];
  const menuGroups = roleData?.menu || [];

  const [openIndexes, setOpenIndexes] = useState([]);
  const [semester, setSemester] = useState("---");

  if (!roleData) return null;

  // ======================
  // LOAD CURRENT SEMESTER
  // ======================
  useEffect(() => {
    const loadSemester = async () => {
      try {
        const data = await getCurrentSemester();

        const semesterText = `${data.name} (${data.academic_year})`;

        setSemester(semesterText);
        localStorage.setItem("currentSemester", semesterText);
      } catch {
        setSemester(
          localStorage.getItem("currentSemester") || "---"
        );
      }
    };

    loadSemester();
  }, []);

  const toggleGroup = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <aside className={`uth-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-app-name">SMD System</div>
        <div className="sidebar-app-sub">
          Đại học Giao thông Vận tải TP.HCM
        </div>

        <div className="sidebar-meta">
          <div>
            Vai trò: <span>{roleData.title}</span>
          </div>
          <div>
            Học kỳ: <span>{semester}</span>
          </div>
        </div>
      </div>

      <div className="sidebar-menu">
        {menuGroups.map((group, index) => (
          <div key={index} className="sidebar-group">
            <div
              className="menu-label"
              onClick={() => toggleGroup(index)}
            >
              <span>{group.label}</span>
              <span
                className={`arrow ${
                  openIndexes.includes(index) ? "open" : ""
                }`}
              >
                ▾
              </span>
            </div>

            {openIndexes.includes(index) && (
              <ul className="submenu">
                {group.items.map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.path} className="submenu-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
