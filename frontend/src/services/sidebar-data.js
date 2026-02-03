export const SIDEBAR_BY_ROLE = {
  // ================= SYSTEM ADMIN =================
  system_admin: {
    title: "Quản trị hệ thống",
    menu: [
      {
        label: "Tổng quan hệ thống",
        items: [
          { label: "Thống kê sử dụng", path: "/admin/overview/statistics" },
          { label: "Theo dõi trạng thái vận hành", path: "/admin/overview/system-status" },
        ],
      },
      {
        label: "Quản lý người dùng",
        items: [
          { label: "Danh sách người dùng", path: "/admin/users" },
          { label: "Tạo tài khoản người dùng", path: "/admin/users/create" },
          { label: "Nhập danh sách người dùng", path: "/admin/users/import" },
          { label: "Phân quyền người dùng", path: "/admin/users/roles" },
          { label: "Khóa hoặc mở khóa tài khoản", path: "/admin/users/status" },
        ],
      },
    ],
  },

  // ================= LECTURER =================
  lecturer: {
    title: "Giảng viên",
    menu: [
      {
        label: "Quản lý đề cương học phần",
        items: [
          { label: "Tạo đề cương học phần", path: "/lecturer/syllabus/create" },
          { label: "Chỉnh sửa đề cương", path: "/lecturer/syllabus/edit" },
          { label: "Xem đề cương phụ trách", path: "/lecturer/syllabus/my" },
          { label: "So sánh phiên bản", path: "/lecturer/syllabus/compare" },
          { label: "Gửi phê duyệt", path: "/lecturer/syllabus/submit" },
        ],
      },
      {
        label: "Thông báo",
        items: [
          { label: "Xem thông báo", path: "/lecturer/notifications" },
        ],
      },
    ],
  },

  // ================= HOD =================
  hod: {
    title: "Trưởng bộ môn",
    menu: [
      {
        label: "Duyệt đề cương",
        items: [
          { label: "Danh sách chờ duyệt", path: "/hod/syllabus/pending" },
          { label: "Đánh giá đề cương", path: "/hod/syllabus/review" },
          { label: "Phê duyệt / Từ chối", path: "/hod/syllabus/approve" },
        ],
      },
    ],
  },

  // ================= ACADEMIC AFFAIRS =================
  academic_affairs: {
    title: "Phòng đào tạo",
    menu: [
      {
        label: "Duyệt đề cương",
        items: [
          { label: "Danh sách chờ duyệt", path: "/academic_affairs/approval/pending" },
          { label: "Đánh giá đề cương", path: "/academic_affairs/approval/evaluate" },
        ],
      },
    ],
  },

  // ================= PRINCIPAL =================
  principal: {
    title: "Ban giám hiệu",
    menu: [
      {
        label: "Tổng quan",
        items: [
          { label: "Thống kê hệ thống", path: "/principal/overview" },
        ],
      },
    ],
  },

  // ================= STUDENT =================
  student: {
    title: "Sinh viên",
    menu: [
      {
        label: "Xem chi tiết",
        items: [
          { label: "Sơ đồ học phần", path: "/student/detail/subject-tree" },
        ],
      },
      {
        label: "Phản hồi",
        items: [
          { label: "Gửi phản hồi", path: "/student/feedback/report" },
        ],
      },
      {
        label: "Thông báo",
        items: [
          { label: "Theo dõi & nhận thông báo", path: "/student/subscribe/notifications" },
        ],
      },
    ],
  },
};