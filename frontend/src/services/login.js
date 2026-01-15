document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  error.innerText = "";

  // chỉ cho email trường
  if (!email.endsWith("@ut.edu.vn")) {
    error.innerText = "Vui lòng dùng email @ut.edu.vn";
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      error.innerText = data.error || "Đăng nhập thất bại";
      return;
    }

    // lưu user
    localStorage.setItem("user", JSON.stringify(data.user));

    // redirect theo role (HTML tĩnh)
    if (data.user.role === "ADMIN") {
      window.location.href = "dashboard-admin.html";
    } else {
      alert("Đăng nhập thành công nhưng chưa có dashboard cho role này");
    }
  } catch (err) {
    error.innerText = "Không kết nối được server";
    console.error(err);
  }
});

/* ===== TOGGLE PASSWORD ===== */
const toggleIcon = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

toggleIcon.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  toggleIcon.src = isHidden
    ? "../../public/eye.svg"
    : "../../public/eye-off.svg";
});
