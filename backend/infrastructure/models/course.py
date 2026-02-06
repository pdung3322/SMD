from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from backend.infrastructure.databases.base import Base
from datetime import datetime

class Course(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True, index=True)
    course_code = Column(String(50), nullable=False)
    course_name = Column(String(255), nullable=False)
    credits = Column(Integer, nullable=False)

    faculty_id = Column(Integer, ForeignKey("faculties.faculty_id"), nullable=False)
    status = Column(String(50), nullable=False, default="ACTIVE")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    # ✅ THÊM 2 DÒNG NÀY
    prerequisite_relations = relationship(
        "CoursePrerequisite",
        foreign_keys="CoursePrerequisite.course_id",
        back_populates="course"
    )

    dependent_relations = relationship(
        "CoursePrerequisite",
        foreign_keys="CoursePrerequisite.prerequisite_course_id",
        back_populates="prerequisite_course"
    )
