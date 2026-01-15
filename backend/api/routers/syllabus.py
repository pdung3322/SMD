from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.infrastructure.databases.database import SessionLocal
from backend.infrastructure.models.syllabus import Syllabus
from backend.api.schemas.syllabus import SyllabusResponse

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
# GET: Danh sách môn học CÓ đề cương
# =====================================================
@router.get("", response_model=List[SyllabusResponse])
def get_syllabus_list(db: Session = Depends(get_db)):
    return (
        db.query(Syllabus)
        .order_by(Syllabus.created_at.desc())
        .all()
    )


# =====================================================
# GET: Chi tiết giáo trình (1 đề cương)
# =====================================================
@router.get("/{syllabus_id}", response_model=SyllabusResponse)
def get_syllabus_detail(
    syllabus_id: int,
    db: Session = Depends(get_db)
):
    syllabus = (
        db.query(Syllabus)
        .filter(Syllabus.syllabus_id == syllabus_id)
        .first()
    )

    if not syllabus:
        raise HTTPException(
            status_code=404,
            detail="Syllabus not found"
        )

    return syllabus
