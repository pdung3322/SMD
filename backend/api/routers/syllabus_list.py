from typing import List
from fastapi import APIRouter, Depends, Form, File, UploadFile, HTTPException
from sqlalchemy.orm import Session

from backend.infrastructure.databases.database import get_db
from backend.infrastructure.services.syllabus_service import syllabus_service
from backend.api.schemas.syllabus import SyllabusListResponse
from backend.api.schemas.syllabus_create import SyllabusCreateResponse

router = APIRouter(
    prefix="/api/lecturer/syllabuses",
    tags=["Lecturer - Syllabus"]
)

# GET: Danh sách giáo trình
@router.get(
    "",
    response_model=List[SyllabusListResponse],
    summary="Lấy danh sách giáo trình của giảng viên"
)
def get_my_syllabuses(db: Session = Depends(get_db)):
    return syllabus_service.get_all(db)

# POST: Tạo giáo trình
@router.post(
    "",
    response_model=SyllabusCreateResponse,
    summary="Tạo giáo trình học phần"
)
def create_syllabus(
    course_code: str = Form(...),
    course_name: str = Form(...),
    credits: int = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    return syllabus_service.create_syllabus(
        db=db,
        course_code=course_code,
        course_name=course_name,
        credits=credits,
        files=files,
        created_by=1
    )

# POST: Gửi giáo trình phê duyệt
@router.post(
    "/{syllabus_id}/submit",
    summary="Gửi giáo trình phê duyệt"
)
def submit_syllabus(syllabus_id: int, db: Session = Depends(get_db)):
    return syllabus_service.submit_syllabus(db, syllabus_id)
