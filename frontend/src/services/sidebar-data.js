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
          {
            label: "Danh sách người dùng",
            path: "/admin/users",
          },
          {
            label: "Tạo tài khoản người dùng",
            path: "/admin/users/create",
          },
          {
            label: "Nhập danh sách người dùng",
            path: "/admin/users/import",
          },
          {
            label: "Phân quyền người dùng",
            path: "/admin/users/permissions",
          },
          {
            label: "Khóa hoặc mở khóa tài khoản",
            path: "/admin/users/status",
          },
        ],
      },

      {
        label: "Quản lý chương trình đào tạo",
        items: [
          { label: "Danh sách chương trình đào tạo", path: "/admin/programs" },
          { label: "Ngành và chuyên ngành", path: "/admin/majors" },
          { label: "Quản lý học phần (môn học)", path: "/admin/courses" },
          { label: "Thiết lập quan hệ học phần", path: "/admin/course-relations" },
        ],
      },

      {
        label: "Quản lý giáo trình học phần",
        items: [
          { label: "Danh sách giáo trình học phần", path: "/admin/syllabus" },
          { label: "Phiên bản học phần", path: "/admin/syllabus/versions" },
          { label: "Theo dõi trạng thái giáo trình", path: "/admin/syllabus/status" },
        ],
      },

      {
        label: "Quản lý chuẩn đầu ra",
        items: [
          { label: "Chuẩn đầu ra học phần (CLO)", path: "/admin/clo" },
          { label: "Chuẩn đầu ra chương trình (PLO)", path: "/admin/plo" },
          { label: "Liên kết CLO – PLO", path: "/admin/clo-plo" },
          { label: "Kiểm tra mức độ bao phủ", path: "/admin/clo-coverage" },
        ],
      },

      {
        label: "Cấu hình quy trình duyệt",
        items: [
          { label: "Cấu hình luồng duyệt", path: "/admin/workflow" },
          { label: "Phân công người duyệt", path: "/admin/workflow/assign" },
          { label: "Theo dõi trạng thái phê duyệt", path: "/admin/workflow/status" },
        ],
      },

      {
        label: "Quản lý năm học và học kỳ",
        items: [
          { label: "Danh sách năm học", path: "/admin/academic-years" },
          { label: "Danh sách học kỳ", path: "/admin/semesters" },
          { label: "Thiết lập học kỳ hiện hành", path: "/admin/current-semester" },
        ],
      },

      {
        label: "Quản lý khoa và bộ môn",
        items: [
          { label: "Danh sách khoa", path: "/admin/faculties" },
          { label: "Danh sách bộ môn", path: "/admin/departments" },
          { label: "Phân công giảng viên phụ trách", path: "/admin/assign-lecturer" },
        ],
      },

      {
        label: "Quản lý thông báo",
        items: [
          { label: "Tạo thông báo hệ thống", path: "/admin/notifications/create" },
          { label: "Theo dõi đăng ký theo dõi", path: "/admin/subscriptions" },
          { label: "Lịch sử gửi thông báo", path: "/admin/notifications/history" },
        ],
      },

      {
        label: "Giám sát và nhật ký hệ thống",
        items: [
          { label: "Nhật ký hệ thống", path: "/admin/system-logs" },
          { label: "Lịch sử đăng nhập", path: "/admin/login-history" },
          { label: "Lịch sử chỉnh sửa dữ liệu", path: "/admin/audit-logs" },
          { label: "Giám sát hoạt động người dùng", path: "/admin/user-activity" },
        ],
      },

      {
        label: "Cấu hình hệ thống",
        items: [
          { label: "Tham số hệ thống", path: "/admin/settings" },
          { label: "Biểu mẫu chuẩn", path: "/admin/templates" },
          { label: "Xử lý tự động", path: "/admin/automation" },
          { label: "Sao lưu & phục hồi dữ liệu", path: "/admin/backup" },
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
        "Tạo đề cương học phần",
        "Chỉnh sửa hoặc cập nhật đề cương học phần",
        "Xem chi tiết đề cương học phần phụ trách",
        "So sánh các phiên bản đề cương học phần",
        "Gửi đề cương học phần phê duyệt",
      ],
    },

    {
      label: "Phản biện chuyên môn",
      items: [
        "Xem phản hồi góp ý",
        "Thêm bình luận phản biện",
        "Chỉnh sửa hoặc xóa bình luận phản biện",
      ],
    },

    {
      label: "Thông báo",
      items: [
        "Xem thông báo trạng thái đề cương học phần",
        "Xem thông báo thay đổi quy trình làm việc",
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


  // ================= HOD =================
hod: {
  title: "Trưởng bộ môn",
  menu: [
    {
      label: "Duyệt giáo trình",
      items: [
          { label: "Danh sách chờ duyệt", path: "/hod/review/pending" },
        ],
      },
      {
        label: "Phản biện cộng tác",
        items: [
          { label: "Phản hồi cộng tác", path: "/hod/collaborative-review" },
        ],
      },
      {
        label: "Tra cứu giáo trình",
        items: [
          { label: "Tra cứu theo năm học và chuyên ngành", path: "/hod/lookup/lookup" },
          { label: "So sánh các phiên bản", path: "/hod/lookup/compare" },
        ],
      },
      {
        label: "Thông báo",
        items: [
          { label: "Thông báo giáo trình mới", path: "/hod/notifications/new" },
          { label: "Thông báo kết quả phản biện", path: "/hod/notifications/reviewresult" },
          { label: "Thông báo yêu cầu", path: "/hod/notifications/request" },
        ],
      },
    ],
  },

  // ================= ACADEMIC AFFAIRS =================
academic_affairs: {
  title: "Phòng đào tạo",
  menu: [
    
    {
      label: "Duyệt giáo trình",
      items: [
        {
          label: "Danh sách giáo trình chờ duyệt",
          path: "/academic_affairs/approval/pending",
        },
        {
          label: "Kiểm tra sự phù hợp với PLO",
          path: "/academic_affairs/approval/plo-check",
        },
        
      
      ],
    },

    {
      label: "Chương trình đào tạo",
      items: [
        {
          label: "Quản lý chuẩn đầu ra PLO",
          path: "/academic_affairs/program/plo-management",
        },
        {
          label: "Quản lý chương trình đào tạo",
          path:"/academic_affairs/program/curriculum",
        },
        
      ],
    },

   

    {
      label: "Tra cứu giáo trình",
      items: [
        {
          label: "Tra cứu theo năm học và học kỳ",
          path: "/academic_affairs/lookup/lookup-by-semester",
        },
        {
          label: "So sánh giáo trình giữa các học kỳ",
          path: "/academic_affairs/lookup/compare-syllabus",
        },
      ],
    },

    {
      label: "Thông báo",
      items: [
        {
          label: "Thông báo giáo trình mới",
          path: "/academic_affairs/notification/approval-result",
        },
        {
          label: "Thông báo yêu cầu",
          path: "/academic_affairs/notification/rejected-or-edit",
        },
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
        "Thống kê tình trạng đề cương",
        "Theo dõi tiến độ phê duyệt",
      ],
    },

    {
      label: "Phê duyệt chiến lược",
      items: [
        "Danh sách đề cương chờ phê duyệt cuối",
        "Phê duyệt hoặc từ chối đề cương",
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
        "Tra cứu đề cương học phần",
        "So sánh các phiên bản đề cương",
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
      label: "Tìm kiếm đề cương học phần",
      items: [
        "Tìm theo môn học",
        "Tìm theo mã môn",
        "Tìm theo ngành và học kỳ",
      ],
    },

    {
      label: "Xem chi tiết đề cương học phần",
      items: [
        "Xem tóm tắt nội dung",
        "Xem sơ đồ quan hệ học phần",
        "Xem tổng quan CLO – PLO",
      ],
    },

    {
      label: "Theo dõi đề cương học phần",
      items: [
        "Nhận thông báo khi đề cương được cập nhật",
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