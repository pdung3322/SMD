from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

#Dung
# class SyllabusResponse(BaseModel):
#     syllabus_id: int
#     course_code: str
#     course_name: str
#     credits: int

#     # Mô tả đề cương (dùng cho trang Chi tiết giáo trình)
#     description: Optional[str] = None

#     created_at: datetime

#     class Config:
#         from_attributes = True


#Tấn
# Response cho danh sách pending
# class SyllabusPendingResponse(BaseModel):
#     syllabus_id: int
#     course_code: str
#     course_name: str
#     faculty_name: Optional[str]
#     lecturer_name: Optional[str]
#     submitted_date: datetime
#     status: str
#     version: str
#     due_date: Optional[datetime]
    
#     class Config:
#         from_attributes = True

# # Response cho chi tiết
# class SyllabusDetailResponse(BaseModel):
#     syllabus_id: int
#     course_code: str
#     course_name: str
#     credits: int
#     description: Optional[str]
#     content: Optional[str]  # Từ syllabus_versions
#     status: str
#     created_by: int
#     lecturer_name: str
#     faculty_name: str
#     current_version: str
    
#     # Thông tin workflow
#     approval_history: list  # Danh sách các lần duyệt
#     review_comments: list   # Danh sách nhận xét
    
#     class Config:
#         from_attributes = True

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


# ===== CLO ITEM (cho trang HOD xem CLO) =====
class CLOItem(BaseModel):
    clo_id: int
    code: str
    description: Optional[str] = None
    level: Optional[str] = None  # Bloom level (K1/K2/K3...)
    status: Optional[str] = None
    note: Optional[str] = None

    class Config:
        from_attributes = True


# ===== VERSION DIFF (cho trang HOD xem thay đổi) =====
class VersionDiffItem(BaseModel):
    id: int
    section: str
    type: str  # added / changed / removed
    before: Optional[str] = None
    after: Optional[str] = None

    class Config:
        from_attributes = True


class VersionDiffResponse(BaseModel):
    syllabus_id: int
    course_name: str
    from_version: str
    to_version: str
    generated_at: datetime
    items: List[VersionDiffItem]

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