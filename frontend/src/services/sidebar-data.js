export const SIDEBAR_BY_ROLE = {
  // ================= SYSTEM ADMIN =================
system_admin: {
  title: "Quản trị hệ thống",
  menu: [
    {
      label: "Tổng quan hệ thống",
      items: [
        {
          label: "Thống kê sử dụng",
          path: "/admin/overview/statistics",
        },
        {
          label: "Theo dõi trạng thái vận hành",
          path: "/admin/overview/system-status",
        },
      ],
    },

    {
      label: "Quản lý người dùng",
      items: [
        { label: "Danh sách người dùng", path: "/admin/users" },
        { label: "Tạo tài khoản người dùng", path: "/admin/users/create" },
        { label: "Nhập danh sách người dùng", path: "/admin/users/import" },
        { label: "Phân quyền người dùng", path: "/admin/users/permissions" },
        { label: "Khóa / mở khóa tài khoản", path: "/admin/users/status" },
      ],
    },

    // 🔥 ĐƯA LÊN TRƯỚC
    {
      label: "Quản lý năm học & học kỳ",
      items: [
        { label: "Danh sách năm học", path: "/admin/academic-years" },
        { label: "Danh sách học kỳ", path: "/admin/semesters" },
        { label: "Thiết lập học kỳ hiện hành", path: "/admin/current-semester" },
      ],
    },

    {
      label: "Quản lý chương trình đào tạo",
      items: [
        { label: "Chương trình đào tạo ", path: "/admin/training-programs" },
        { label: "Quan hệ học phần", path: "/admin/course-relations" },
      ],
    },

    {
      label: "Quản lý giáo trình học phần",
      items: [
        { label: "Danh sách giáo trình học phần", path: "/admin/syllabus" },
        { label: "Phiên bản giáo trình", path: "/admin/syllabus/versions" },
        { label: "Theo dõi trạng thái giáo trình", path: "/admin/syllabus/status" },
      ],
    },


    {
      label: "Cấu hình quy trình duyệt",
      items: [
        { label: "Cấu hình luồng duyệt", path: "/admin/workflow" },
        { label: "Theo dõi trạng thái phê duyệt", path: "/admin/workflow/status" },
      ],
    },

    {
      label: "Giám sát hệ thống",
      items: [
        { label: "Nhật ký hệ thống", path: "/admin/system-logs" },
      ],
    },
  ],
},

 // ================= LECTURER =================
// ================= LECTURER =================
lecturer: {
  title: "Giảng viên",
  menu: [
    {
      label: "Giáo trình học phần",
      items: [
        {
  label: "Danh sách giáo trình học phần",
 path: "/lecturer/syllabuses",
},

        {
          label: "Tạo giáo trình học phần",
          path: "/lecturer/syllabus/create",
        },
        {
          label: "So sánh các phiên bản giáo trình",
          path: "/lecturer/syllabus/compare",
        },
        {
          label: "Gửi giáo trình phê duyệt",
          path: "/lecturer/syllabus/approval",
        },
      ],
    },

    {
      label: "Phản hồi & chỉnh sửa",
  items: [
    {
      label: "Nhận xét",
      path: "/lecturer/comments",
    },
    {
      label: "Phản hồi nhận xét",
      path: "/lecturer/comment-reply",
    },
    {
      label: "Cập nhật giáo trình theo yêu cầu",
      path: "/lecturer/syllabus-update",
    },
  ],
},
    {
      label: "Thông báo",
  items: [
    {
      label: "Trạng thái giáo trình học phần",
      path: "/lecturer/syllabus-status-test",
    },
    {
      label: "Thay đổi quy trình làm việc",
      path: "/lecturer/workflow-change",
    },
  ],
},

  ],
},

  // ================= HOD =================
hod: {
  title: "Trưởng bộ môn",
  menu: [
    {
      label: "Duyệt giáo trình học phần",
      items: [
        "Xem giáo trình chờ duyệt",
        "Kiểm tra CLO",
        "Xem thay đổi phiên bản",
        "Đánh giá giáo trình",
        "Phản biện chuyên môn",
        "Tổng hợp ý kiến",
        "Phê duyệt hoặc từ chối giáo trình",
      ],
    },

    {
      label: "Tra cứu giáo trình",
      items: [
        "Tra cứu theo năm học và chuyên ngành",
        "So sánh các phiên bản giáo trình",
      ],
    },

    {
      label: "Thông báo",
      items: [
        "Thông báo giáo trình mới",
        "Thông báo kết quả phản biện",
        "Thông báo yêu cầu chỉnh sửa",
      ],
    },

    {
      label: "Hỗ trợ",
      items: [
        "Gửi yêu cầu hỗ trợ",
        "Báo lỗi và góp ý",
      ],
    },
  ],
},




 // ================= ACADEMIC AFFAIRS =================
academic_affairs: {
  title: "Phòng đào tạo",
  menu: [
    {
      label: "Duyệt giáo trình học phần",
      items: [
        "Xem giáo trình chờ duyệt",
        "Kiểm tra sự phù hợp với PLO",
        "Đánh giá giáo trình",
        "Phê duyệt hoặc từ chối giáo trình",
      ],
    },

    {
      label: "Quản lý chương trình đào tạo",
      items: [
        "Quản lý chuẩn đầu ra chương trình (PLO)",
        "Quản lý cấu trúc chương trình đào tạo",
        "Quản lý học phần trong chương trình",
      ],
    },

    {
      label: "Tra cứu và báo cáo",
      items: [
        "Tra cứu giáo trình theo năm học và học kỳ",
        "So sánh giáo trình giữa các học kỳ",
      ],
    },

    {
      label: "Thông báo",
      items: [
        "Thông báo kết quả duyệt giáo trình",
        "Thông báo giáo trình bị từ chối hoặc yêu cầu chỉnh sửa",
      ],
    },

    {
      label: "Hỗ trợ",
      items: [
        "Gửi yêu cầu hỗ trợ",
        "Báo lỗi và góp ý",
      ],
    },
  ],
},



  // ================= PRINCIPAL =================
principal: {
  title: "Ban giám hiệu",
  menu: [
    {
      label: "Tổng quan điều hành",
      items: [
        "Tổng quan hoạt động đào tạo",
        "Thống kê tình trạng giáo trình",
        "Theo dõi tiến độ phê duyệt",
      ],
    },

    {
      label: "Phê duyệt chiến lược",
      items: [
        "Danh sách đề giáo trình chờ phê duyệt cuối",
        "Phê duyệt hoặc từ chối giáo trình",
        "Xem ý kiến phản biện và đánh giá",
      ],
    },

    {
      label: "Giám sát chất lượng đào tạo",
      items: [
        "Theo dõi mức độ đạt chuẩn đầu ra",
        "Đánh giá chất lượng chương trình đào tạo",
        "Phân tích liên kết chuẩn đầu ra",
      ],
    },

    {
      label: "Báo cáo và thống kê",
      items: [
        "Báo cáo tổng hợp toàn hệ thống",
        "Báo cáo theo khoa và bộ môn",
        "Báo cáo theo năm học",
      ],
    },

    {
      label: "Tra cứu",
      items: [
        "Tra cứu giáo trình học phần",
        "So sánh các phiên bản giáo trình",
      ],
    },

    {
      label: "Thông báo",
      items: [
        "Danh sách thông báo điều hành",
      ],
    },

    {
      label: "Hỗ trợ",
      items: [
        "Gửi yêu cầu hỗ trợ kỹ thuật",
        "Báo lỗi và góp ý",
      ],
    },
  ],
},


  // ================= STUDENT =================
student: {
  title: "Sinh viên",
  menu: [
    {
      label: "Tìm kiếm giáo trình học phần",
      items: [
        "Tìm theo môn học",
        "Tìm theo mã môn",
        "Tìm theo ngành và học kỳ",
      ],
    },

    {
      label: "Xem chi tiết đề giáo trình học phần",
      items: [
        "Xem tóm tắt nội dung",
        "Xem sơ đồ quan hệ học phần",
        "Xem tổng quan CLO – PLO",
      ],
    },

    {
      label: "Theo dõi giáo trình học phần",
      items: [
        "Nhận thông báo khi giáo trình được cập nhật",
      ],
    },

    {
      label: "Phản hồi",
      items: [
        "Gửi phản hồi và góp ý",
      ],
    },
  ],
},
};