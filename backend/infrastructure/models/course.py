from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
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
