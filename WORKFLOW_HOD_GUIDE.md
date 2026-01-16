# 📘 Hướng dẫn: Luồng làm việc trang HOD (Ví dụ: Pending → Detail)

## 🎯 Tổng quan luồng

Khi làm 1 trang mới trong phần HOD, bạn cần liên quan đến **6 lớp (layers)**:

```
┌─────────────────────────────────────────────────────────────┐
│  1. DATABASE (SQL Server)                                   │
│     └── Tables: syllabus, syllabus_versions,                │
│                 approval_workflows, review_comments         │
├─────────────────────────────────────────────────────────────┤
│  2. BACKEND MODELS (SQLAlchemy ORM)                        │
│     └── backend/infrastructure/models/*.py                  │
├─────────────────────────────────────────────────────────────┤
│  3. BACKEND SCHEMAS (Pydantic)                             │
│     └── backend/api/schemas/*.py                            │
├─────────────────────────────────────────────────────────────┤
│  4. BACKEND ROUTERS (FastAPI)                              │
│     └── backend/api/routers/*.py                            │
├─────────────────────────────────────────────────────────────┤
│  5. FRONTEND ROUTES (React Router)                         │
│     └── frontend/src/app.jsx                                │
├─────────────────────────────────────────────────────────────┤
│  6. FRONTEND PAGES/COMPONENTS (React)                      │
│     └── frontend/src/pages/hod/**/*.jsx                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Ví dụ cụ thể: Pending → Detail

### **User Story:**
> Trưởng bộ môn (HOD) xem danh sách đề cương chờ duyệt, nhấn nút "Xem chi tiết" 
> → Mở trang chi tiết để đánh giá đề cương.

---

## 🔢 Các bước thực hiện

### **BƯỚC 1: DATABASE** ✅ (Đã có)
Kiểm tra tables cần thiết trong SQL Server:

```sql
-- Bảng chính
SELECT * FROM syllabus;
SELECT * FROM syllabus_versions;
SELECT * FROM approval_workflows;
SELECT * FROM users;

-- Dữ liệu mẫu cần có:
-- syllabus: Thông tin đề cương (course_code, course_name, status)
-- syllabus_versions: Các phiên bản đề cương
-- approval_workflows: Lịch sử duyệt (reviewer_id, status, comment)
```

**File:** Database `smd_db`

---

### **BƯỚC 2: BACKEND MODELS** ✅ (Đã có)
Định nghĩa các model ORM tương ứng với database tables:

**File:** `backend/infrastructure/models/`
- `syllabus.py` - Model Syllabus
- `syllabus_version.py` - Model SyllabusVersion
- `approval_workflow.py` - Model ApprovalWorkflow
- `user.py` - Model User

```python
# backend/infrastructure/models/syllabus.py
class Syllabus(Base):
    __tablename__ = "syllabus"
    
    syllabus_id = Column(Integer, primary_key=True)
    course_code = Column(String(50))
    course_name = Column(String(255))
    status = Column(String(50), default="DRAFT")
    created_by = Column(Integer, ForeignKey("users.user_id"))
    # ...
```

---

### **BƯỚC 3: BACKEND SCHEMAS** ⚠️ (Cần bổ sung)
Định nghĩa Pydantic schemas để validate/serialize dữ liệu API:

**File cần tạo/sửa:** `backend/api/schemas/syllabus.py`

```python
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Response cho danh sách pending
class SyllabusPendingResponse(BaseModel):
    syllabus_id: int
    course_code: str
    course_name: str
    faculty_name: Optional[str]
    lecturer_name: Optional[str]
    submitted_date: datetime
    status: str
    version: str
    due_date: Optional[datetime]
    
    class Config:
        from_attributes = True

# Response cho chi tiết
class SyllabusDetailResponse(BaseModel):
    syllabus_id: int
    course_code: str
    course_name: str
    credits: int
    description: Optional[str]
    content: Optional[str]  # Từ syllabus_versions
    status: str
    created_by: int
    lecturer_name: str
    faculty_name: str
    current_version: str
    
    # Thông tin workflow
    approval_history: list  # Danh sách các lần duyệt
    review_comments: list   # Danh sách nhận xét
    
    class Config:
        from_attributes = True
```

---

### **BƯỚC 4: BACKEND ROUTERS** ⚠️ (Cần bổ sung)
Tạo API endpoints để frontend gọi:

**File:** `backend/api/routers/syllabus.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

router = APIRouter(prefix="/syllabus", tags=["Syllabus"])

# ===== API 1: Lấy danh sách pending cho HOD =====
@router.get("/pending", response_model=List[SyllabusPendingResponse])
def get_pending_syllabi(
    hod_id: int,  # Từ JWT token hoặc query param
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách đề cương đang chờ HOD duyệt
    """
    syllabi = (
        db.query(Syllabus)
        .join(ApprovalWorkflow)
        .filter(
            ApprovalWorkflow.reviewer_id == hod_id,
            ApprovalWorkflow.reviewer_role == "HOD",
            ApprovalWorkflow.status == "PENDING"
        )
        .join(User, Syllabus.created_by == User.user_id)
        .all()
    )
    
    # Transform data
    result = []
    for s in syllabi:
        result.append({
            "syllabus_id": s.syllabus_id,
            "course_code": s.course_code,
            "course_name": s.course_name,
            "lecturer_name": s.creator.full_name,  # Relationship
            "submitted_date": s.created_at,
            "status": s.status,
            # ...
        })
    
    return result


# ===== API 2: Lấy chi tiết đề cương =====
@router.get("/{syllabus_id}/detail", response_model=SyllabusDetailResponse)
def get_syllabus_detail(
    syllabus_id: int,
    db: Session = Depends(get_db)
):
    """
    Lấy chi tiết đầy đủ của 1 đề cương
    Bao gồm: nội dung, lịch sử duyệt, comments
    """
    syllabus = (
        db.query(Syllabus)
        .options(
            joinedload(Syllabus.versions),       # Eager load versions
            joinedload(Syllabus.workflows),      # Eager load workflows
            joinedload(Syllabus.comments)        # Eager load comments
        )
        .filter(Syllabus.syllabus_id == syllabus_id)
        .first()
    )
    
    if not syllabus:
        raise HTTPException(status_code=404, detail="Syllabus not found")
    
    # Lấy version mới nhất
    latest_version = (
        db.query(SyllabusVersion)
        .filter(SyllabusVersion.syllabus_id == syllabus_id)
        .order_by(SyllabusVersion.version_number.desc())
        .first()
    )
    
    return {
        "syllabus_id": syllabus.syllabus_id,
        "course_code": syllabus.course_code,
        "course_name": syllabus.course_name,
        "content": latest_version.content if latest_version else "",
        "current_version": f"v{latest_version.version_number}",
        "approval_history": [
            {
                "reviewer": w.reviewer.full_name,
                "status": w.status,
                "comment": w.comment,
                "reviewed_at": w.reviewed_at
            }
            for w in syllabus.workflows
        ],
        "review_comments": [
            {
                "reviewer": c.reviewer.full_name,
                "content": c.content,
                "created_at": c.created_at
            }
            for c in syllabus.comments
        ]
    }


# ===== API 3: Submit đánh giá =====
@router.post("/{syllabus_id}/review")
def submit_review(
    syllabus_id: int,
    data: ReviewSubmitRequest,
    db: Session = Depends(get_db)
):
    """
    HOD submit đánh giá (approve/reject/request_revision)
    """
    # Update workflow status
    workflow = (
        db.query(ApprovalWorkflow)
        .filter(
            ApprovalWorkflow.syllabus_id == syllabus_id,
            ApprovalWorkflow.reviewer_id == data.reviewer_id,
            ApprovalWorkflow.status == "PENDING"
        )
        .first()
    )
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    workflow.status = data.decision  # APPROVED / REJECTED
    workflow.comment = data.feedback
    workflow.reviewed_at = datetime.now()
    
    # Update syllabus status
    syllabus = db.query(Syllabus).get(syllabus_id)
    if data.decision == "APPROVED":
        syllabus.status = "APPROVED_BY_HOD"
    else:
        syllabus.status = "REJECTED"
    
    db.commit()
    
    return {"message": "Review submitted successfully"}
```

**File cần đăng ký:** `backend/app.py`
```python
from backend.api.routers.syllabus import router as syllabus_router

app.include_router(syllabus_router)
```

---

### **BƯỚC 5: FRONTEND ROUTES** ✅ (Đã có)
Đăng ký routes trong React Router:

**File:** `frontend/src/app.jsx`

```jsx
import Pending from "./pages/hod/review/pending";
import Evaluate from "./pages/hod/review/evaluate";

// ...
<Route path="/hod/review/pending" element={<Pending />} />
<Route path="/hod/review/evaluate/:id" element={<Evaluate />} />
```

---

### **BƯỚC 6: FRONTEND PAGES** ⚠️ (Cần hoàn thiện)

#### **6.1. Trang Pending (List)**
**File:** `frontend/src/pages/hod/review/pending.jsx`

**Nhiệm vụ:**
1. Gọi API `/syllabus/pending` để lấy danh sách
2. Hiển thị table với các đề cương
3. Có nút "Xem chi tiết" → Navigate sang trang Evaluate với `id`

```jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Pending() {
    const [syllabi, setSyllabi] = useState([]);
    
    useEffect(() => {
        // Gọi API
        axios.get("http://127.0.0.1:8000/syllabus/pending?hod_id=1")
            .then(res => setSyllabi(res.data))
            .catch(err => console.error(err));
    }, []);
    
    return (
        <div>
            <h1>Đề cương chờ duyệt</h1>
            <table>
                <thead>
                    <tr>
                        <th>Mã môn</th>
                        <th>Tên môn</th>
                        <th>Giảng viên</th>
                        <th>Ngày nộp</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {syllabi.map(s => (
                        <tr key={s.syllabus_id}>
                            <td>{s.course_code}</td>
                            <td>{s.course_name}</td>
                            <td>{s.lecturer_name}</td>
                            <td>{s.submitted_date}</td>
                            <td>
                                {/* TRUYỀN ID QUA URL */}
                                <Link to={`/hod/review/evaluate/${s.syllabus_id}`}>
                                    Xem chi tiết
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
```

**Key Points:**
- ✅ Gọi API với `axios.get()`
- ✅ Sử dụng `<Link to={...}>` để navigate
- ✅ Truyền `syllabus_id` qua URL: `/evaluate/${s.syllabus_id}`

---

#### **6.2. Trang Evaluate (Detail)**
**File:** `frontend/src/pages/hod/review/evaluate.jsx`

**Nhiệm vụ:**
1. Nhận `id` từ URL params (`useParams`)
2. Gọi API `/syllabus/{id}/detail` để lấy chi tiết
3. Hiển thị nội dung đề cương, lịch sử duyệt, comments
4. Form để HOD nhập đánh giá
5. Submit đánh giá qua API `/syllabus/{id}/review`

```jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Evaluate() {
    const { id } = useParams();  // ← LẤY ID TỪ URL
    const navigate = useNavigate();
    
    const [syllabus, setSyllabus] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [decision, setDecision] = useState("");
    
    // Load chi tiết đề cương
    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/syllabus/${id}/detail`)
            .then(res => setSyllabus(res.data))
            .catch(err => alert("Không tải được đề cương"));
    }, [id]);
    
    // Submit đánh giá
    const handleSubmit = () => {
        axios.post(`http://127.0.0.1:8000/syllabus/${id}/review`, {
            reviewer_id: 1,  // Lấy từ user đang login
            decision: decision,
            feedback: feedback
        })
        .then(() => {
            alert("Đánh giá thành công!");
            navigate("/hod/review/pending");  // Quay lại trang pending
        })
        .catch(err => alert("Lỗi khi gửi đánh giá"));
    };
    
    if (!syllabus) return <div>Đang tải...</div>;
    
    return (
        <div>
            <h1>Chi tiết: {syllabus.course_name}</h1>
            
            {/* Thông tin cơ bản */}
            <section>
                <h2>Thông tin đề cương</h2>
                <p><strong>Mã môn:</strong> {syllabus.course_code}</p>
                <p><strong>Giảng viên:</strong> {syllabus.lecturer_name}</p>
                <p><strong>Phiên bản:</strong> {syllabus.current_version}</p>
            </section>
            
            {/* Nội dung đề cương */}
            <section>
                <h2>Nội dung</h2>
                <div dangerouslySetInnerHTML={{ __html: syllabus.content }} />
            </section>
            
            {/* Lịch sử duyệt */}
            <section>
                <h2>Lịch sử phê duyệt</h2>
                <ul>
                    {syllabus.approval_history.map((h, i) => (
                        <li key={i}>
                            {h.reviewer} - {h.status} - {h.comment}
                        </li>
                    ))}
                </ul>
            </section>
            
            {/* Form đánh giá */}
            <section>
                <h2>Đánh giá của bạn</h2>
                <textarea 
                    placeholder="Nhập nhận xét..."
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                />
                
                <div>
                    <label>
                        <input type="radio" name="decision" value="APPROVED" 
                               onChange={e => setDecision(e.target.value)} />
                        Phê duyệt
                    </label>
                    <label>
                        <input type="radio" name="decision" value="REJECTED"
                               onChange={e => setDecision(e.target.value)} />
                        Từ chối
                    </label>
                </div>
                
                <button onClick={handleSubmit}>Gửi đánh giá</button>
            </section>
        </div>
    );
}
```

**Key Points:**
- ✅ `useParams()` để lấy `id` từ URL
- ✅ `useEffect(() => {...}, [id])` - Load data khi component mount
- ✅ Gọi API `/syllabus/${id}/detail` với axios
- ✅ `useNavigate()` để quay lại trang pending sau khi submit
- ✅ Form controlled components (feedback, decision state)

---

## 📊 Tổng kết: Checklist cho 1 trang mới

| Bước | File/Folder | Công việc | Trạng thái |
|------|-------------|-----------|------------|
| 1️⃣ | Database | Tạo/kiểm tra tables | ✅ |
| 2️⃣ | `backend/infrastructure/models/` | Tạo ORM models | ✅ |
| 3️⃣ | `backend/api/schemas/` | Tạo Pydantic schemas | ⚠️ Cần làm |
| 4️⃣ | `backend/api/routers/` | Tạo API endpoints | ⚠️ Cần làm |
| 5️⃣ | `backend/app.py` | Đăng ký router | ⚠️ Cần làm |
| 6️⃣ | `frontend/src/app.jsx` | Đăng ký routes | ✅ |
| 7️⃣ | `frontend/src/pages/hod/` | Tạo component page | ⚠️ Cần hoàn thiện |
| 8️⃣ | CSS | Styling | 🎨 Tùy chọn |

---

## 🔗 Luồng dữ liệu khi nhấn "Xem chi tiết"

```
┌─────────────────────────────────────────────────────────────┐
│  USER ACTION: Click "Xem chi tiết" trên trang Pending       │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND: <Link to={`/hod/review/evaluate/${id}`}>        │
│  → React Router navigate sang URL mới                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND: Component Evaluate mount                         │
│  → useParams() lấy id từ URL                                 │
│  → useEffect gọi API                                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  API CALL: GET /syllabus/{id}/detail                        │
│  → axios.get(`http://127.0.0.1:8000/syllabus/${id}/detail`) │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  BACKEND: FastAPI router nhận request                       │
│  → @router.get("/{syllabus_id}/detail")                     │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  DATABASE: Query với SQLAlchemy                             │
│  → db.query(Syllabus).filter(...).first()                   │
│  → JOIN với users, versions, workflows, comments            │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  BACKEND: Transform data theo Pydantic schema               │
│  → Return JSON response                                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND: Nhận response                                    │
│  → setSyllabus(res.data)                                     │
│  → Component re-render với data mới                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  UI: Hiển thị chi tiết đề cương                             │
│  → Nội dung, lịch sử duyệt, form đánh giá                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 Lưu ý quan trọng

### **1. Relationships trong Models (Quan trọng!)**
Để JOIN dữ liệu dễ dàng, cần định nghĩa relationships:

```python
# backend/infrastructure/models/syllabus.py
from sqlalchemy.orm import relationship

class Syllabus(Base):
    __tablename__ = "syllabus"
    # ...
    
    # Relationships
    creator = relationship("User", foreign_keys=[created_by])
    versions = relationship("SyllabusVersion", back_populates="syllabus")
    workflows = relationship("ApprovalWorkflow", back_populates="syllabus")
    comments = relationship("ReviewComment", back_populates="syllabus")
```

### **2. API Base URL nên dùng config tập trung**
```javascript
// frontend/src/services/api.js
import axios from "axios";

export const API_BASE = "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;
```

Dùng:
```jsx
import api from "@/services/api";

api.get(`/syllabus/${id}/detail`)
   .then(res => setSyllabus(res.data));
```

### **3. Authentication**
Trong production, cần:
- JWT token để xác thực user
- Middleware kiểm tra role (HOD, AA, PRINCIPAL)
- Axios interceptor để tự động gửi token

```javascript
// Add token vào mọi request
api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

---

## 🎯 Kết luận

**Để tạo trang Pending → Detail trong phần HOD, bạn cần:**

1. ✅ **Database**: Tables đã có sẵn
2. ✅ **Models**: ORM models đã có
3. ⚠️ **Schemas**: Cần tạo Pydantic schemas cho API response
4. ⚠️ **API Routers**: Cần tạo 3 endpoints:
   - `GET /syllabus/pending` - Danh sách chờ duyệt
   - `GET /syllabus/{id}/detail` - Chi tiết đề cương
   - `POST /syllabus/{id}/review` - Submit đánh giá
5. ✅ **Frontend Routes**: Đã có trong app.jsx
6. ⚠️ **Frontend Pages**: Cần hoàn thiện logic gọi API thật

**Workflow:**
```
Pending.jsx → Click "Chi tiết" → 
  → Navigate `/hod/review/evaluate/:id` → 
    → Evaluate.jsx mount → 
      → useParams() lấy id → 
        → axios.get(`/syllabus/${id}/detail`) → 
          → Backend query DB → 
            → Return JSON → 
              → Frontend hiển thị
```

Hy vọng hướng dẫn này giúp bạn hiểu rõ luồng làm việc! 🚀
