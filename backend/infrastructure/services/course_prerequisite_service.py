from sqlalchemy.orm import Session
from backend.infrastructure.models.course_prerequisite import CoursePrerequisite
from backend.infrastructure.repositories.course_prerequisite_repository import (
    CoursePrerequisiteRepository
)

class CoursePrerequisiteService:

    @staticmethod
    def get_all(db: Session):
        return CoursePrerequisiteRepository.get_all(db)

    @staticmethod
    def get_by_course_id(db: Session, course_id: int):
        return (
            db.query(CoursePrerequisite)
            .filter(CoursePrerequisite.course_id == course_id)
            .all()
        )

    @staticmethod
    def create(
        db: Session,
        course_id: int,
        prerequisite_course_id: int,
        relation_type: str,
        note: str | None = None
    ):
        obj = CoursePrerequisite(
            course_id=course_id,
            prerequisite_course_id=prerequisite_course_id,
            relation_type=relation_type,
            note=note,
            status="ACTIVE"
        )
        return CoursePrerequisiteRepository.create(db, obj)

    @staticmethod
    def delete(db: Session, prerequisite_id: int):
        obj = db.get(CoursePrerequisite, prerequisite_id)
        if not obj:
            return
        CoursePrerequisiteRepository.delete(db, obj)
