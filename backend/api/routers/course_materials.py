from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.infrastructure.databases.database import SessionLocal
from backend.infrastructure.models.course_material import CourseMaterial

router = APIRouter(
    prefix="/course-materials",
    tags=["Course Materials"]
)


# ===== DB DEPENDENCY =====
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ===== LIST MATERIALS BY SYLLABUS =====
@router.get("/{syllabus_id}")
def get_materials_by_syllabus(
    syllabus_id: int,
    db: Session = Depends(get_db)
):
    materials = db.query(CourseMaterial).filter(
        CourseMaterial.syllabus_id == syllabus_id
    ).all()

    return materials
