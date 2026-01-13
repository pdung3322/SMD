import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../assets/header.css";
import logoUTH from "../images/logo_uth.png";

import {
  getCurrentUser,
  getDisplayName,
  getAvatarLetter,
  clearUser,
  normalizeRole,
} from "../services/layout";

export default function Header({ onToggleSidebar }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const user = getCurrentUser();

  // đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  const handleLogoClick = () => {
    const role = normalizeRole(user?.role);

    switch (role) {
      case "system_admin":
        navigate("/admin");
        break;
      case "academic_affairs":
        navigate("/academic_affairs/dashboard");
        break;
      case "hod":
        navigate("/hod");
        break;
      case "principal":
        navigate("/principal");
        break;
      case "lecturer":
        navigate("/lecturer");
        break;
      case "student":
        navigate("/student");
        break;
      default:
        navigate("/login");
    }
  };

  if (!user) return null;

  return (
    <header className="uth-header">
      {/* LEFT */}
      <div className="header-left">
        <button
          className="menu-btn"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
        >
          ☰
        </button>

        <img
          src={logoUTH}
          alt="UTH"
          className="header-logo"
          style={{ cursor: "pointer" }}
          onClick={handleLogoClick}
        />
      </div>

      {/* RIGHT */}
      <div className="header-right" ref={menuRef}>
        <div
          className="user-box"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="avatar">
            {getAvatarLetter(user)}
          </div>

          <span className="username">
            {getDisplayName(user)}
          </span>

          <span className={`arrow ${open ? "open" : ""}`}>
            ▾
          </span>
        </div>

        {open && (
          <div className="user-dropdown">
            <div className="dropdown-item">
              Thông tin cá nhân
            </div>
            <div className="dropdown-item">
              Đổi mật khẩu
            </div>
            <div className="dropdown-divider"></div>
            <div
              className="dropdown-item logout"
              onClick={handleLogout}
            >
              Đăng xuất
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
