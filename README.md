# Syllabus Management and Digitalization System (SMD)

## 📌 Giới thiệu
SMD là hệ thống quản lý và số hóa đề cương học phần cho trường đại học.

## 🛠 Công nghệ sử dụng
- Backend: FastAPI, SQL Server
- Frontend: ReactJS
- Authentication: JWT
- Database: SQL Server

## Cấu trúc thư mục
- backend/: FastAPI source code
- frontend/: React source code
- docs/: Tài liệu đồ án

## 🚀Cách chạy project
 - Bước 1: Tạo môi trường ảo co Python (phiên bản 3.x)
     ## Windows:
     		py -m venv .venv
     ## Unix/MacOS:
     		python3 -m venv .venv
   - Bước 2: Kích hoạt môi trường:
     ## Windows:
     		.venv\Scripts\activate.ps1
     ### Nếu xảy ra lỗi active .venv trên winos run powshell -->Administrator
         Set-ExecutionPolicy RemoteSigned -Force
     ## Unix/MacOS:
     		source .venv/bin/activate
     
   - Bước 3: Cài đặt các thư viện cần thiết
     ## Install:
      cd backend
     	pip install -r requirements.txt

    ## Lệnh ánh xạ ORM:
      python -m backend.infrastructure.databases.db_init 

    ### Backend:
      uvicorn backend.app:app --reload --port 8000

    ### Frontend:
      cd frontend

      npm run dev

