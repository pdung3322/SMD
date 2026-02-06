from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from sqlalchemy.orm import relationship
from backend.infrastructure.databases.base import Base
from datetime import datetime

class CoursePrerequisite(Base):
    __tablename__ = "course_prerequisites"

    prerequisite_id = Column(Integer, primary_key=True, index=True)

    course_id = Column(
        Integer,
        ForeignKey("courses.course_id"),
        nullable=False
    )

    prerequisite_course_id = Column(
        Integer,
        ForeignKey("courses.course_id"),
        nullable=False
    )

    relation_type = Column(String(30), nullable=False)
    note = Column(String(255))
    status = Column(String(50), default="ACTIVE")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    course = relationship(
        "Course",
        foreign_keys=[course_id],
        back_populates="prerequisite_relations"
    )

    prerequisite_course = relationship(
        "Course",
        foreign_keys=[prerequisite_course_id],
        back_populates="dependent_relations"
    )
