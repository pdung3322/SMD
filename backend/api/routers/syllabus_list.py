from typing import List
from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException
from sqlalchemy.orm import Session

from backend.infrastructure.databases.database import SessionLocal
from backend.infrastructure.services.syllabus_service import SyllabusService
from backend.api.schemas.syllabus import SyllabusListResponse
from backend.api.schemas.syllabus_create import SyllabusCreateResponse

router = APIRouter(
    prefix="/api/lecturer/syllabuses",
    tags=["Lecturer - Syllabus"]
)

# ===== DB DEPENDENCY =====
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# GET: Danh sách giáo trình
@router.get(
    "",
    response_model=List[SyllabusListResponse],
    summary="Lấy danh sách giáo trình của giảng viên"
)
def get_my_syllabuses(db: Session = Depends(get_db)):
    service = SyllabusService(db)
    return service.get_all()

# POST: Tạo giáo trình
@router.post(
    "",
    response_model=SyllabusCreateResponse,
    summary="Tạo giáo trình học phần"
)
def create_syllabus(
    course_code: str = Form(...),
    course_name: str = Form(...),
    credits: str = Form(...),  # FastAPI nhận từ Form dạng string
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
):  
    # Convert credits từ string sang int
    try:
        credits_int = int(credits)
    except ValueError:
        raise HTTPException(status_code=400, detail="Số tín chỉ phải là số nguyên")
    
    if credits_int <= 0:
        raise HTTPException(status_code=400, detail="Số tín chỉ phải lớn hơn 0")
    
    service = SyllabusService(db)
    return service.create_syllabus(
        course_code=course_code,
        course_name=course_name,
        credits=credits_int,
        files=files,
        created_by=1
    )

# POST: Gửi giáo trình phê duyệt
@router.post(
    "/{syllabus_id}/submit",
    summary="Gửi giáo trình phê duyệt"
)
def submit_syllabus(syllabus_id: int, db: Session = Depends(get_db)):
    service = SyllabusService(db)
    return service.submit_syllabus(syllabus_id)
