import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../assets/login.css";
import logoUTH from "../images/logo_uth.png";
import eyeOff from "../images/eye-off.svg";
import eyeOn from "../images/eye.svg";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("SUBMIT", email, password);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        { email, password }
      );

      console.log("RES", res.data);

      const user = res.data;

      if (!user || !user.role) {
        setError("Dữ liệu đăng nhập không hợp lệ");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));

      switch (user.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "HOD":
          navigate("/hod/dashboard");
          break;
        case "AA":
          navigate("/academic_affairs/dashboard");
          break;
        case "PRINCIPAL":
          navigate("/principal");
          break;
        case "LECTURER":
          navigate("/lecturer");
          break;
        case "STUDENT":
          navigate("/student");
          break;
        default:
          setError("Vai trò không hợp lệ");
      }
    } catch (err) {
      console.error(err);
      setError("Sai email hoặc mật khẩu");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logoUTH} alt="UTH Logo" className="login-logo" />

        <h2>Đăng nhập hệ thống SMD</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email (@ut.edu.vn)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <img
              src={showPassword ? eyeOn : eyeOff}
              alt="Toggle password"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <button type="submit">Đăng nhập</button>
        </form>

        <div className="forgot-password">
          <a href="#">Quên mật khẩu?</a>
        </div>
      </div>
    </div>
  );
}
