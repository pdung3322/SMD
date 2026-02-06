# repositories/course_prerequisite_repository.py
from sqlalchemy.orm import Session, selectinload
from backend.infrastructure.models.course_prerequisite import CoursePrerequisite

class CoursePrerequisiteRepository:

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(CoursePrerequisite)
            .options(
                selectinload(CoursePrerequisite.course),
                selectinload(CoursePrerequisite.prerequisite_course)
            )
            .all()
        )

    @staticmethod
    def create(db: Session, obj: CoursePrerequisite):
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    @staticmethod
    def delete(db: Session, obj: CoursePrerequisite):
        db.delete(obj)
        db.commit()
