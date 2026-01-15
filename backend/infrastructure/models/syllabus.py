from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from backend.infrastructure.databases.base import Base
from datetime import datetime

class Syllabus(Base):
    __tablename__ = "syllabus"

    syllabus_id = Column(Integer, primary_key=True, index=True)
    course_code = Column(String(50), nullable=False)
    course_name = Column(String(255), nullable=False)
    credits = Column(Integer, nullable=False)
    description = Column(String(500))

    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)

    status = Column(String(50), nullable=False, default="DRAFT")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
