from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from backend.infrastructure.databases.database import get_db
from backend.api.schemas.course_relation_schema import (
    CourseRelationCreate,
    CourseRelationResponse
)
from backend.infrastructure.services.course_prerequisite_service import (
    CoursePrerequisiteService
)

router = APIRouter(
    prefix="/course-relations",
    tags=["Course Relations"]
)

# =========================
# GET ALL
# =========================
@router.get(
    "/",
    response_model=List[CourseRelationResponse]
)
def get_all_course_relations(
    db: Session = Depends(get_db)
):
    return CoursePrerequisiteService.get_all(db)

# =========================
# GET BY COURSE ID
# =========================
@router.get("/")
def get_all_course_relations(db: Session = Depends(get_db)):
    relations = CoursePrerequisiteService.get_all(db)

    return [
        {
            "id": r.id,
            "relation_type": r.relation_type,
            "course": {
                "course_id": r.course.course_id,
                "course_name": r.course.course_name
            },
            "prerequisite_course": {
                "course_id": r.prerequisite_course.course_id,
                "course_name": r.prerequisite_course.course_name
            }
        }
        for r in relations
    ]


# =========================
# CREATE
# =========================
@router.post(
    "/",
    response_model=CourseRelationResponse,
    status_code=status.HTTP_201_CREATED
)
def create_course_relation(
    data: CourseRelationCreate,
    db: Session = Depends(get_db)
):
    return CoursePrerequisiteService.create(
        db=db,
        course_id=data.course_id,
        prerequisite_course_id=data.prerequisite_course_id,
        relation_type=data.relation_type
    )

# =========================
# DELETE
# =========================
@router.delete("/{relation_id}")
def delete_course_relation(
    relation_id: int,
    db: Session = Depends(get_db)
):
    CoursePrerequisiteService.delete(db, relation_id)
    return {"message": "Đã xóa quan hệ học phần"}
