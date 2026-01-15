// Lấy user hiện tại từ localStorage
export function getCurrentUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

// Xóa user khi logout
export function clearUser() {
  localStorage.removeItem("user");
}

// Hiển thị tên người dùng
export function getDisplayName(user) {
  return user?.full_name || user?.email || "User";
}

// Lấy chữ cái avatar
export function getAvatarLetter(user) {
  const name = getDisplayName(user);
  return name.charAt(0).toUpperCase();
}

// Chuẩn hóa role để dùng cho sidebar / route
export function normalizeRole(role) {
  const map = {
    ADMIN: "system_admin",
    LECTURER: "lecturer",
    HOD: "hod",
    AA: "academic_affairs",
    PRINCIPAL: "principal",
    STUDENT: "student",
  };

  return map[role] || role;
}
