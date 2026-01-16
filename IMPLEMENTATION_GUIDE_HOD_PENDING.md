# 🚀 Hướng dẫn triển khai: Luồng Pending cho HOD

Đây là code skeleton đầy đủ cho workflow duyệt HOD. Copy & paste vào project khi sẵn sàng.

---

## ✅ BƯỚC 1: ORM Models - Thêm Relationships

### File: `backend/infrastructure/models/syllabus.py`
```python
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ...infrastructure.databases.base import Base
from datetime import datetime

class Syllabus(Base):
    __tablename__ = "syllabus"

    syllabus_id = Column(Integer, primary_key=True, index=True)
    course_code = Column(String(50), nullable=False)
    course_name = Column(String(255), nullable=False)
    credits = Column(Integer, nullable=False)
    description = Column(String(500))

    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    status = Column(String(50), nullable=False, default="DRAFT")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    # ===== RELATIONSHIPS (để eager-load) =====
    # Người tạo đề cương
    creator = relationship("User", foreign_keys=[created_by])
    # Các phiên bản của đề cương
    versions = relationship("SyllabusVersion", back_populates="syllabus")
    # Quy trình duyệt (HOD → AA → PRINCIPAL)
    workflows = relationship("ApprovalWorkflow", back_populates="syllabus")
    # Nhận xét/góp ý trong quá trình duyệt
    comments = relationship("ReviewComment", back_populates="syllabus")
```

---

### File: `backend/infrastructure/models/syllabus_version.py`
```python
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from ...infrastructure.databases.base import Base
from datetime import datetime

class SyllabusVersion(Base):
    __tablename__ = "syllabus_versions"

    version_id = Column(Integer, primary_key=True, index=True)
    syllabus_id = Column(Integer, ForeignKey("syllabus.syllabus_id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # ===== RELATIONSHIPS =====
    syllabus = relationship("Syllabus", back_populates="versions")
    creator = relationship("User")
```

---

### File: `backend/infrastructure/models/approval_workflow.py`
```python
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ...infrastructure.databases.base import Base
from datetime import datetime

class ApprovalWorkflow(Base):
    __tablename__ = "approval_workflows"

    workflow_id = Column(Integer, primary_key=True, index=True)
    syllabus_id = Column(Integer, ForeignKey("syllabus.syllabus_id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    reviewer_role = Column(String(50), nullable=False)  # HOD / AA / PRINCIPAL
    step_order = Column(Integer, nullable=False)
    status = Column(String(50), nullable=False, default="PENDING")  # PENDING / APPROVED / REJECTED / REVISION
    comment = Column(String(500))
    reviewed_at = Column(DateTime, default=None)

    # ===== RELATIONSHIPS =====
    syllabus = relationship("Syllabus", back_populates="workflows")
    reviewer = relationship("User")
```

---

### File: `backend/infrastructure/models/review_comment.py`
```python
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from ...infrastructure.databases.base import Base
from datetime import datetime

class ReviewComment(Base):
    __tablename__ = "review_comments"

    comment_id = Column(Integer, primary_key=True, index=True)
    syllabus_id = Column(Integer, ForeignKey("syllabus.syllabus_id"), nullable=False)
    version_id = Column(Integer, ForeignKey("syllabus_versions.version_id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    reviewer_role = Column(String(50), nullable=False)  # HOD / AA / PRINCIPAL
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # ===== RELATIONSHIPS =====
    syllabus = relationship("Syllabus", back_populates="comments")
    version = relationship("SyllabusVersion")
    reviewer = relationship("User")
```

---

## ✅ BƯỚC 2: Pydantic Schemas - DTO

### File: `backend/api/schemas/syllabus.py` (tạo mới hoặc bổ sung)

```python
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# ===== PENDING LIST (Danh sách đề cương chờ HOD duyệt) =====
class SyllabusPendingItem(BaseModel):
    """
    DTO cho item trong danh sách pending
    """
    syllabus_id: int
    course_code: str
    course_name: str
    lecturer_name: Optional[str]
    submitted_date: datetime
    status: str
    current_version: str
    
    class Config:
        from_attributes = True


# ===== APPROVAL HISTORY (Lịch sử duyệt) =====
class ApprovalHistoryItem(BaseModel):
    """
    DTO cho 1 bước duyệt trong lịch sử
    """
    workflow_id: int
    reviewer_name: str
    reviewer_role: str
    status: str  # PENDING / APPROVED / REJECTED / REVISION
    comment: Optional[str]
    reviewed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


# ===== REVIEW COMMENT (Nhận xét) =====
class ReviewCommentItem(BaseModel):
    """
    DTO cho 1 comment trong danh sách comments
    """
    comment_id: int
    reviewer_name: str
    reviewer_role: str
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ===== DETAIL (Chi tiết đề cương) =====
class SyllabusDetail(BaseModel):
    """
    DTO cho trang xem chi tiết đề cương (HOD duyệt)
    Bao gồm: thông tin cơ bản + content phiên bản mới nhất + lịch sử duyệt + comments
    """
    syllabus_id: int
    course_code: str
    course_name: str
    credits: int
    description: Optional[str]
    
    # Thông tin phiên bản mới nhất
    content: str  # Nội dung HTML/Text
    current_version: str  # "v1", "v2", ...
    lecturer_name: str
    lecturer_id: int
    
    # Lịch sử duyệt và comments
    approval_history: List[ApprovalHistoryItem]
    review_comments: List[ReviewCommentItem]
    
    class Config:
        from_attributes = True


# ===== REVIEW SUBMIT REQUEST (Gửi quyết định HOD) =====
class ReviewSubmitRequest(BaseModel):
    """
    DTO cho request submit quyết định duyệt
    """
    decision: str  # APPROVED / REJECTED / REVISION
    feedback: Optional[str] = None  # Nhận xét của HOD
    
    class Config:
        from_attributes = True


# ===== REVIEW SUBMIT RESPONSE =====
class ReviewSubmitResponse(BaseModel):
    """
    DTO cho response sau khi submit
    """
    message: str
    workflow_id: int
    syllabus_id: int
    new_status: str  # Trạng thái mới của syllabus
    
    class Config:
        from_attributes = True


# ===== (CÓ SẵN) =====
class SyllabusResponse(BaseModel):
    """
    DTO chung cho syllabus (đã có)
    """
    syllabus_id: int
    course_code: str
    course_name: str
    credits: int
    description: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
```

---

## ✅ BƯỚC 3: Repositories - Tách logic truy vấn

### File: `backend/infrastructure/repositories/syllabus_repository.py` (tạo mới)

```python
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_
from backend.infrastructure.models.syllabus import Syllabus
from backend.infrastructure.models.approval_workflow import ApprovalWorkflow
from typing import List, Optional


class SyllabusRepository:
    """
    Repository để quản lý Syllabus
    Tách logic DB ra khỏi service
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_pending_for_hod(self, hod_id: int) -> List[Syllabus]:
        """
        Lấy danh sách đề cương đang chờ HOD duyệt
        
        Query: JOIN Syllabus với ApprovalWorkflow
               WHERE reviewer_id = hod_id AND role = HOD AND status = PENDING
        """
        syllabi = (
            self.db.query(Syllabus)
            .join(ApprovalWorkflow)
            .filter(
                and_(
                    ApprovalWorkflow.reviewer_id == hod_id,
                    ApprovalWorkflow.reviewer_role == "HOD",
                    ApprovalWorkflow.status == "PENDING"
                )
            )
            .options(
                joinedload(Syllabus.creator),
                joinedload(Syllabus.versions),
                joinedload(Syllabus.workflows),
            )
            .distinct()
            .all()
        )
        return syllabi
    
    def get_by_id(self, syllabus_id: int) -> Optional[Syllabus]:
        """
        Lấy 1 syllabus theo ID
        Eager-load: creator, versions, workflows, comments
        """
        syllabus = (
            self.db.query(Syllabus)
            .filter(Syllabus.syllabus_id == syllabus_id)
            .options(
                joinedload(Syllabus.creator),
                joinedload(Syllabus.versions),
                joinedload(Syllabus.workflows).joinedload(ApprovalWorkflow.reviewer),
                joinedload(Syllabus.comments),
            )
            .first()
        )
        return syllabus
    
    def update_status(self, syllabus_id: int, new_status: str) -> None:
        """
        Cập nhật trạng thái syllabus
        """
        syllabus = self.db.query(Syllabus).filter(
            Syllabus.syllabus_id == syllabus_id
        ).first()
        
        if syllabus:
            syllabus.status = new_status
            from datetime import datetime
            syllabus.updated_at = datetime.utcnow()
            self.db.commit()
```

---

### File: `backend/infrastructure/repositories/approval_workflow_repository.py` (tạo mới)

```python
from sqlalchemy.orm import Session
from sqlalchemy import and_
from backend.infrastructure.models.approval_workflow import ApprovalWorkflow
from typing import Optional
from datetime import datetime


class ApprovalWorkflowRepository:
    """
    Repository để quản lý quy trình duyệt
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_pending_workflow(
        self, 
        syllabus_id: int, 
        reviewer_id: int, 
        reviewer_role: str = "HOD"
    ) -> Optional[ApprovalWorkflow]:
        """
        Lấy workflow PENDING cho reviewer
        Dùng để kiểm tra trước khi cập nhật
        """
        workflow = (
            self.db.query(ApprovalWorkflow)
            .filter(
                and_(
                    ApprovalWorkflow.syllabus_id == syllabus_id,
                    ApprovalWorkflow.reviewer_id == reviewer_id,
                    ApprovalWorkflow.reviewer_role == reviewer_role,
                    ApprovalWorkflow.status == "PENDING"
                )
            )
            .first()
        )
        return workflow
    
    def update_status(
        self,
        workflow_id: int,
        new_status: str,
        comment: str = None
    ) -> None:
        """
        Cập nhật trạng thái workflow
        """
        workflow = self.db.query(ApprovalWorkflow).filter(
            ApprovalWorkflow.workflow_id == workflow_id
        ).first()
        
        if workflow:
            workflow.status = new_status
            workflow.comment = comment
            workflow.reviewed_at = datetime.utcnow()
            self.db.commit()
    
    def get_workflows_by_syllabus(
        self, 
        syllabus_id: int
    ) -> list:
        """
        Lấy tất cả workflows của 1 syllabus (lịch sử duyệt)
        """
        workflows = (
            self.db.query(ApprovalWorkflow)
            .filter(ApprovalWorkflow.syllabus_id == syllabus_id)
            .order_by(ApprovalWorkflow.step_order)
            .all()
        )
        return workflows
```

---

### File: `backend/infrastructure/repositories/review_comment_repository.py` (tạo mới)

```python
from sqlalchemy.orm import Session
from backend.infrastructure.models.review_comment import ReviewComment
from typing import List
from datetime import datetime


class ReviewCommentRepository:
    """
    Repository để quản lý comment/nhận xét
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def add_comment(
        self,
        syllabus_id: int,
        version_id: int,
        reviewer_id: int,
        reviewer_role: str,
        content: str
    ) -> ReviewComment:
        """
        Thêm comment mới khi HOD/AA/PRINCIPAL phản hồi
        """
        comment = ReviewComment(
            syllabus_id=syllabus_id,
            version_id=version_id,
            reviewer_id=reviewer_id,
            reviewer_role=reviewer_role,
            content=content,
            created_at=datetime.utcnow()
        )
        self.db.add(comment)
        self.db.commit()
        self.db.refresh(comment)  
        return comment
    
    def get_comments_by_syllabus(
        self, 
        syllabus_id: int
    ) -> List[ReviewComment]:
        """
        Lấy tất cả comments của 1 syllabus
        """
        comments = (
            self.db.query(ReviewComment)
            .filter(ReviewComment.syllabus_id == syllabus_id)
            .order_by(ReviewComment.created_at.desc())
            .all()
        )
        return comments
```

---

## ✅ BƯỚC 4: Service - Business Logic

### File: `backend/services/approval_service.py` (tạo mới)

```python
from sqlalchemy.orm import Session
from backend.infrastructure.repositories.syllabus_repository import SyllabusRepository
from backend.infrastructure.repositories.approval_workflow_repository import ApprovalWorkflowRepository
from backend.infrastructure.repositories.review_comment_repository import ReviewCommentRepository
from backend.infrastructure.models.syllabus_version import SyllabusVersion
from backend.api.schemas.syllabus import (
    SyllabusPendingItem,
    SyllabusDetail,
    ApprovalHistoryItem,
    ReviewCommentItem,
    ReviewSubmitResponse
)
from typing import List, Optional
from fastapi import HTTPException
from datetime import datetime


class ApprovalService:
    """
    Service xử lý logic duyệt cho HOD/AA/PRINCIPAL
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.syllabus_repo = SyllabusRepository(db)
        self.workflow_repo = ApprovalWorkflowRepository(db)
        self.comment_repo = ReviewCommentRepository(db)
    
    def list_pending_for_hod(self, hod_id: int) -> List[SyllabusPendingItem]:
        """
        Lấy danh sách đề cương đang chờ HOD duyệt
        
        Logic:
        1. Query từ repo lấy syllabus pending cho HOD
        2. Map ra DTO SyllabusPendingItem
        """
        syllabi = self.syllabus_repo.get_pending_for_hod(hod_id)
        
        result = []
        for s in syllabi:
            # Lấy phiên bản mới nhất
            latest_version = (
                self.db.query(SyllabusVersion)
                .filter(SyllabusVersion.syllabus_id == s.syllabus_id)
                .order_by(SyllabusVersion.version_number.desc())
                .first()
            )
            
            item = SyllabusPendingItem(
                syllabus_id=s.syllabus_id,
                course_code=s.course_code,
                course_name=s.course_name,
                lecturer_name=s.creator.full_name if s.creator else "N/A",
                submitted_date=s.created_at,
                status=s.status,
                current_version=f"v{latest_version.version_number}" if latest_version else "v0"
            )
            result.append(item)
        
        return result
    
    def get_syllabus_detail(self, syllabus_id: int) -> SyllabusDetail:
        """
        Lấy chi tiết đề cương để HOD duyệt
        
        Logic:
        1. Lấy syllabus từ repo (eager-load)
        2. Lấy phiên bản mới nhất
        3. Lấy lịch sử duyệt (workflows)
        4. Lấy comments
        5. Map ra DTO SyllabusDetail
        """
        syllabus = self.syllabus_repo.get_by_id(syllabus_id)
        
        if not syllabus:
            raise HTTPException(status_code=404, detail="Syllabus not found")
        
        # Phiên bản mới nhất
        latest_version = (
            self.db.query(SyllabusVersion)
            .filter(SyllabusVersion.syllabus_id == syllabus_id)
            .order_by(SyllabusVersion.version_number.desc())
            .first()
        )
        
        if not latest_version:
            raise HTTPException(status_code=404, detail="No version found")
        
        # Lịch sử duyệt
        workflows = self.workflow_repo.get_workflows_by_syllabus(syllabus_id)
        approval_history = [
            ApprovalHistoryItem(
                workflow_id=w.workflow_id,
                reviewer_name=w.reviewer.full_name if w.reviewer else "N/A",
                reviewer_role=w.reviewer_role,
                status=w.status,
                comment=w.comment,
                reviewed_at=w.reviewed_at
            )
            for w in workflows
        ]
        
        # Comments
        comments = self.comment_repo.get_comments_by_syllabus(syllabus_id)
        review_comments = [
            ReviewCommentItem(
                comment_id=c.comment_id,
                reviewer_name=c.reviewer.full_name if c.reviewer else "N/A",
                reviewer_role=c.reviewer_role,
                content=c.content,
                created_at=c.created_at
            )
            for c in comments
        ]
        
        # Tổng hợp thành DTO
        detail = SyllabusDetail(
            syllabus_id=syllabus.syllabus_id,
            course_code=syllabus.course_code,
            course_name=syllabus.course_name,
            credits=syllabus.credits,
            description=syllabus.description,
            content=latest_version.content,
            current_version=f"v{latest_version.version_number}",
            lecturer_name=syllabus.creator.full_name if syllabus.creator else "N/A",
            lecturer_id=syllabus.created_by,
            approval_history=approval_history,
            review_comments=review_comments
        )
        
        return detail
    
    def submit_hod_review(
        self,
        syllabus_id: int,
        hod_id: int,
        decision: str,
        feedback: Optional[str] = None
    ) -> ReviewSubmitResponse:
        """
        HOD submit quyết định duyệt/từ chối/yêu cầu chỉnh sửa
        
        Logic:
        1. Kiểm tra workflow PENDING cho HOD
        2. Cập nhật workflow status
        3. Cập nhật syllabus status dựa trên quyết định
        4. Lưu comment
        5. Trả về response
        
        Decision mapping:
        - APPROVED → syllabus status = APPROVED_BY_HOD (chuyển sang AA)
        - REJECTED → syllabus status = REJECTED_BY_HOD
        - REVISION → syllabus status = REVISION_REQUESTED_BY_HOD
        """
        # Kiểm tra workflow PENDING
        workflow = self.workflow_repo.get_pending_workflow(
            syllabus_id, hod_id, "HOD"
        )
        
        if not workflow:
            raise HTTPException(
                status_code=404,
                detail="No pending workflow found for this HOD"
            )
        
        # Cập nhật workflow
        self.workflow_repo.update_status(
            workflow.workflow_id,
            decision,
            feedback
        )
        
        # Cập nhật syllabus status
        status_mapping = {
            "APPROVED": "APPROVED_BY_HOD",
            "REJECTED": "REJECTED_BY_HOD",
            "REVISION": "REVISION_REQUESTED_BY_HOD"
        }
        new_syllabus_status = status_mapping.get(decision, "PENDING")
        self.syllabus_repo.update_status(syllabus_id, new_syllabus_status)
        
        # Lưu comment nếu có feedback
        if feedback:
            latest_version = (
                self.db.query(SyllabusVersion)
                .filter(SyllabusVersion.syllabus_id == syllabus_id)
                .order_by(SyllabusVersion.version_number.desc())
                .first()
            )
            
            if latest_version:
                self.comment_repo.add_comment(
                    syllabus_id=syllabus_id,
                    version_id=latest_version.version_id,
                    reviewer_id=hod_id,
                    reviewer_role="HOD",
                    content=feedback
                )
        
        return ReviewSubmitResponse(
            message="HOD review submitted successfully",
            workflow_id=workflow.workflow_id,
            syllabus_id=syllabus_id,
            new_status=new_syllabus_status
        )
```

---

## ✅ BƯỚC 5: Router - API Endpoints

### File: `backend/api/routers/syllabus.py` (bổ sung)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.infrastructure.databases.database import SessionLocal
from backend.api.schemas.syllabus import (
    SyllabusPendingItem,
    SyllabusDetail,
    ReviewSubmitRequest,
    ReviewSubmitResponse
)
from backend.services.approval_service import ApprovalService

router = APIRouter(
    prefix="/syllabus",
    tags=["Syllabus"]
)

# ===== DB DEPENDENCY =====
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =====================================================
# HOD ENDPOINTS
# =====================================================

@router.get("/pending", response_model=List[SyllabusPendingItem])
def get_pending_for_hod(
    hod_id: int,
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách đề cương đang chờ HOD duyệt
    
    Query param: hod_id (ID của HOD đang đăng nhập)
    Return: List[SyllabusPendingItem]
    """
    try:
        service = ApprovalService(db)
        pending_list = service.list_pending_for_hod(hod_id)
        return pending_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{syllabus_id}/detail", response_model=SyllabusDetail)
def get_syllabus_detail_for_review(
    syllabus_id: int,
    db: Session = Depends(get_db)
):
    """
    Lấy chi tiết đề cương để HOD duyệt
    Bao gồm: nội dung, lịch sử duyệt, comments
    
    Path param: syllabus_id
    Return: SyllabusDetail
    """
    try:
        service = ApprovalService(db)
        detail = service.get_syllabus_detail(syllabus_id)
        return detail
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{syllabus_id}/review", response_model=ReviewSubmitResponse)
def submit_hod_review(
    syllabus_id: int,
    request: ReviewSubmitRequest,
    hod_id: int,
    db: Session = Depends(get_db)
):
    """
    HOD gửi quyết định duyệt/từ chối/yêu cầu chỉnh sửa
    
    Path param: syllabus_id
    Query param: hod_id (ID của HOD đang đăng nhập)
    Body: ReviewSubmitRequest {decision, feedback}
    Return: ReviewSubmitResponse
    
    Decision values:
    - APPROVED: Phê duyệt (chuyển sang AA)
    - REJECTED: Từ chối
    - REVISION: Yêu cầu chỉnh sửa
    """
    try:
        service = ApprovalService(db)
        response = service.submit_hod_review(
            syllabus_id=syllabus_id,
            hod_id=hod_id,
            decision=request.decision,
            feedback=request.feedback
        )
        return response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =====================================================
# EXISTING ENDPOINTS (giữ lại cũ)
# =====================================================

@router.get("", response_model=List[dict])
def get_syllabus_list(db: Session = Depends(get_db)):
    """Danh sách tất cả syllabus"""
    # Keep existing logic
    pass


@router.get("/{syllabus_id}", response_model=dict)
def get_syllabus_info(syllabus_id: int, db: Session = Depends(get_db)):
    """Chi tiết syllabus (cơ bản, không kèm approval info)"""
    # Keep existing logic
    pass
```

### File: `backend/app.py` (bổ sung include_router)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routers.auth import router as auth_router
from backend.api.routers.users import router as user_router
from backend.api.routers.syllabus import router as syllabus_router  # ← THÊM DÒNG NÀY

app = FastAPI(
    title="SMD Backend API",
    version="1.0.0"
)

# ===== CORS =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== Register routers =====
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(syllabus_router)  # ← THÊM DÒNG NÀY
```

---

## ✅ BƯỚC 6: Frontend - React

### File: `frontend/src/app.jsx` (sửa route)

```jsx
// Tìm route này:
<Route
  path="/hod/review/evaluate"
  element={
    <ProtectedRoute allowedRoles={["HOD"]}>
      <Evaluate />
    </ProtectedRoute>
  }
/>

// Sửa thành:
<Route
  path="/hod/review/evaluate/:id"  {/* ← Thêm :id */}
  element={
    <ProtectedRoute allowedRoles={["HOD"]}>
      <Evaluate />
    </ProtectedRoute>
  }
/>
```

---

### File: `frontend/src/services/api.js` (tạo axios instance)

```javascript
import axios from "axios";

export const API_BASE = "http://127.0.0.1:8000";

/**
 * Axios instance được cấu hình sẵn baseURL
 * Dùng cho tất cả API calls
 */
const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

/**
 * Interceptor: Thêm token vào mọi request
 * (Optional - bạn sẽ implement authentication sau)
 */
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

/**
 * Interceptor: Xử lý lỗi response
 * (Optional - bạn sẽ implement error handling sau)
 */
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Token hết hạn, redirect login
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
```

---

### File: `frontend/src/pages/hod/review/pending.jsx` (thay mock bằng API)

```jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";  // ← IMPORT api
import "./pending.css";

/* ===== STATUS MAP ===== */
const STATUS_LABEL = {
  ALL: "Tất cả",
  PENDING: "Chờ duyệt",
  APPROVED_BY_HOD: "Đã phê duyệt",
  REJECTED_BY_HOD: "Bị từ chối",
  REVISION_REQUESTED_BY_HOD: "Yêu cầu chỉnh sửa",
};

const STATUS_TABS = [
  { key: "ALL" },
  { key: "PENDING" },
  { key: "APPROVED_BY_HOD" },
  { key: "REJECTED_BY_HOD" },
];

export default function Pending() {
  const [syllabi, setSyllabi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");
  const [activeStatus, setActiveStatus] = useState("ALL");

  /* ===== LOAD DATA TỪ API =====*/
  useEffect(() => {
    // Lấy hod_id từ user đang login (tạm thời dùng 1, cần integrate auth sau)
    const hod_id = 1;  // TODO: lấy từ localStorage hoặc context
    
    api.get("/syllabus/pending", { params: { hod_id } })
      .then((res) => {
        setSyllabi(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Load pending syllabi error:", err);
        setError("Không thể tải danh sách đề cương. Vui lòng thử lại.");
        setLoading(false);
      });
  }, []);

  /* ===== STATUS COUNT ===== */
  const statusCounts = useMemo(() => {
    const counts = { ALL: syllabi.length };
    syllabi.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return counts;
  }, [syllabi]);

  /* ===== FILTER + SORT ===== */
  const filteredSyllabi = useMemo(() => {
    const keyword = q.trim().toLowerCase();

    const list = syllabi
      .filter((s) => {
        const matchStatus = activeStatus === "ALL" || s.status === activeStatus;
        const matchSearch =
          !keyword ||
          (s.course_name || "").toLowerCase().includes(keyword) ||
          (s.course_code || "").toLowerCase().includes(keyword) ||
          (s.lecturer_name || "").toLowerCase().includes(keyword);

        return matchStatus && matchSearch;
      })
      .sort((a, b) => {
        const da = new Date(a.submitted_date).getTime();
        const db = new Date(b.submitted_date).getTime();
        return db - da;
      });

    return list;
  }, [syllabi, q, activeStatus]);

  /* ===== QUICK STATS ===== */
  const quickStats = useMemo(() => {
    return {
      total: filteredSyllabi.length,
      pending: filteredSyllabi.filter((s) => s.status === "PENDING").length,
      approved: filteredSyllabi.filter((s) => s.status === "APPROVED_BY_HOD").length,
    };
  }, [filteredSyllabi]);

  if (loading) return <div className="pending-page">Đang tải...</div>;
  if (error) return <div className="pending-page">{error}</div>;

  return (
    <div className="pending-page">
      <h1 className="pending-page-title">Đề cương chờ duyệt</h1>

      {/* ===== STATUS TABS ===== */}
      <div className="status-tabs">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            className={`status-tab ${activeStatus === t.key ? "active" : ""}`}
            onClick={() => setActiveStatus(t.key)}
          >
            {STATUS_LABEL[t.key]}
          </button>
        ))}
      </div>

      {/* ===== FILTER ===== */}
      <div className="pending-filter-card">
        <div className="pending-filter-row">
          <div className="filter-group">
            <label>Tìm kiếm</label>
            <input
              placeholder="Tìm theo tên môn học, mã môn, giảng viên..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="pending-stats">
            <span className="stat-pill stat-total">Tổng: {quickStats.total}</span>
            <span className="stat-pill stat-pending">Chờ duyệt: {quickStats.pending}</span>
            <span className="stat-pill stat-approved">Đã duyệt: {quickStats.approved}</span>
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="pending-table-card">
        {filteredSyllabi.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">Không có đề cương phù hợp.</div>
          </div>
        ) : (
          <table className="uth-table">
            <thead>
              <tr>
                <th className="col-stt">STT</th>
                <th>Môn học</th>
                <th>Giảng viên</th>
                <th>Ngày gửi</th>
                <th>Phiên bản</th>
                <th style={{ width: 140 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredSyllabi.map((s, index) => (
                <tr key={s.syllabus_id}>
                  <td className="col-stt">{index + 1}</td>
                  <td>
                    <div className="course-info">
                      <div className="course-name">{s.course_name}</div>
                      <div className="course-code">{s.course_code}</div>
                    </div>
                  </td>
                  <td>{s.lecturer_name}</td>
                  <td>
                    {s.submitted_date
                      ? new Date(s.submitted_date).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td>{s.current_version}</td>
                  <td>
                    {/* ← DÙNG syllabus_id THAY VÌ id */}
                    <Link
                      to={`/hod/review/evaluate/${s.syllabus_id}`}
                      className="btn-outline"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
```

---

### File: `frontend/src/pages/hod/review/evaluate.jsx` (call API thật)

```jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";  // ← IMPORT api
import "./evaluate.css";

export default function Evaluate() {
  const { id } = useParams();  // ← Lấy syllabus_id từ URL
  const navigate = useNavigate();

  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [decision, setDecision] = useState("");

  /* ===== LOAD CHI TIẾT ĐỀ CƯƠNG ===== */
  useEffect(() => {
    api.get(`/syllabus/${id}/detail`)
      .then((res) => {
        setSyllabus(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading syllabus detail:", err);
        setLoading(false);
      });
  }, [id]);

  /* ===== SUBMIT QUYẾT ĐỊNH HOD ===== */
  const handleSubmit = () => {
    if (!decision) {
      alert("Vui lòng chọn quyết định.");
      return;
    }

    setSubmitting(true);

    const hod_id = 1;  // TODO: lấy từ user đang login

    api.post(`/syllabus/${id}/review`, 
      {
        decision: decision,
        feedback: feedback || null
      },
      {
        params: { hod_id }
      }
    )
      .then((res) => {
        alert("Quyết định duyệt đã được gửi!");
        navigate("/hod/review/pending");
      })
      .catch((err) => {
        alert(
          err.response?.data?.detail ||
          "Gửi quyết định thất bại. Vui lòng thử lại."
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (loading) return <div className="evaluate-page">Đang tải...</div>;
  if (!syllabus) return <div className="evaluate-page">Không tìm thấy đề cương.</div>;

  return (
    <div className="evaluate-page">
      <h1 className="evaluate-title">Đánh giá: {syllabus.course_name}</h1>

      {/* ===== THÔNG TIN ĐỀ CƯƠNG ===== */}
      <div className="evaluate-card">
        <h3>Thông tin đề cương</h3>
        <p>
          <strong>Mã môn:</strong> {syllabus.course_code}
        </p>
        <p>
          <strong>Tên môn:</strong> {syllabus.course_name}
        </p>
        <p>
          <strong>Tín chỉ:</strong> {syllabus.credits}
        </p>
        <p>
          <strong>Giảng viên:</strong> {syllabus.lecturer_name}
        </p>
        <p>
          <strong>Phiên bản hiện tại:</strong> {syllabus.current_version}
        </p>
      </div>

      {/* ===== NỘI DUNG ĐỀ CƯƠNG ===== */}
      <div className="evaluate-card">
        <h3>Nội dung chi tiết</h3>
        <div className="syllabus-content">
          {/* Nếu content là HTML, dùng dangerouslySetInnerHTML */}
          <div dangerouslySetInnerHTML={{ __html: syllabus.content }} />
        </div>
      </div>

      {/* ===== LỊCH SỬ DUYỆT ===== */}
      <div className="evaluate-card">
        <h3>Lịch sử phê duyệt</h3>
        {syllabus.approval_history.length === 0 ? (
          <p>Chưa có bước duyệt nào.</p>
        ) : (
          <ul className="approval-list">
            {syllabus.approval_history.map((h) => (
              <li key={h.workflow_id}>
                <strong>{h.reviewer_name}</strong> ({h.reviewer_role}):{" "}
                <span className={`status-badge ${h.status.toLowerCase()}`}>
                  {h.status}
                </span>
                {h.comment && <p>Ghi chú: {h.comment}</p>}
                {h.reviewed_at && (
                  <p className="timestamp">
                    {new Date(h.reviewed_at).toLocaleString("vi-VN")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ===== NHẬN XÉT TRONG QUÁ TRÌNH ===== */}
      <div className="evaluate-card">
        <h3>Nhận xét</h3>
        {syllabus.review_comments.length === 0 ? (
          <p>Chưa có nhận xét.</p>
        ) : (
          <ul className="comment-list">
            {syllabus.review_comments.map((c) => (
              <li key={c.comment_id}>
                <strong>{c.reviewer_name}</strong> ({c.reviewer_role}):
                <p>{c.content}</p>
                <p className="timestamp">
                  {new Date(c.created_at).toLocaleString("vi-VN")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ===== FORM ĐÁNH GIÁ HOD ===== */}
      <div className="evaluate-card">
        <h3>Quyết định của HOD</h3>

        <div className="form-group">
          <label>Nhận xét (tuỳ chọn)</label>
          <textarea
            placeholder="Nhập nhận xét chi tiết của bạn..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={5}
          />
        </div>

        <div className="form-group">
          <label>Quyết định</label>
          <div className="decision-options">
            <label>
              <input
                type="radio"
                name="decision"
                value="APPROVED"
                checked={decision === "APPROVED"}
                onChange={(e) => setDecision(e.target.value)}
              />
              ✓ Phê duyệt
            </label>
            <label>
              <input
                type="radio"
                name="decision"
                value="REJECTED"
                checked={decision === "REJECTED"}
                onChange={(e) => setDecision(e.target.value)}
              />
              ✗ Từ chối
            </label>
            <label>
              <input
                type="radio"
                name="decision"
                value="REVISION"
                checked={decision === "REVISION"}
                onChange={(e) => setDecision(e.target.value)}
              />
              ⟲ Yêu cầu chỉnh sửa
            </label>
          </div>
        </div>

        <div className="evaluate-actions">
          <button
            onClick={() => navigate("/hod/review/pending")}
            className="btn-secondary"
          >
            ← Quay lại
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? "Đang gửi..." : "Gửi quyết định"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 📋 Tóm tắt các file cần tạo/sửa

| Bước | File | Hành động | 
|------|------|----------|
| 1 | `backend/infrastructure/models/syllabus.py` | Thêm relationships |
| 1 | `backend/infrastructure/models/syllabus_version.py` | Thêm relationships |
| 1 | `backend/infrastructure/models/approval_workflow.py` | Thêm relationships |
| 1 | `backend/infrastructure/models/review_comment.py` | Thêm relationships |
| 2 | `backend/api/schemas/syllabus.py` | Tạo mới |
| 3 | `backend/infrastructure/repositories/syllabus_repository.py` | Tạo mới |
| 3 | `backend/infrastructure/repositories/approval_workflow_repository.py` | Tạo mới |
| 3 | `backend/infrastructure/repositories/review_comment_repository.py` | Tạo mới |
| 4 | `backend/services/approval_service.py` | Tạo mới |
| 5 | `backend/api/routers/syllabus.py` | Bổ sung endpoints |
| 5 | `backend/app.py` | Include router |
| 6 | `frontend/src/app.jsx` | Sửa route `/hod/review/evaluate/:id` |
| 6 | `frontend/src/services/api.js` | Tạo axios instance |
| 6 | `frontend/src/pages/hod/review/pending.jsx` | Gọi API thật |
| 6 | `frontend/src/pages/hod/review/evaluate.jsx` | Gọi API thật + submit |

---

## ✨ Sau khi làm xong

1. Test API bằng Postman/Thunder Client:
   - `GET http://localhost:8000/syllabus/pending?hod_id=1`
   - `GET http://localhost:8000/syllabus/1/detail`
   - `POST http://localhost:8000/syllabus/1/review?hod_id=1`

2. Test Frontend:
   - Truy cập `http://localhost:5173/hod/review/pending`
   - Xem danh sách pending
   - Click "Chi tiết" → mở trang Evaluate
   - Submit quyết định → quay lại Pending

3. Kiểm tra DB:
   - Thay đổi trạng thái `syllabus.status`
   - Cập nhật `approval_workflows.status` và `reviewed_at`

---

Bạn sẵn sàng copy code này vào project chưa?
