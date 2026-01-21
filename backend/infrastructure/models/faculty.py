from sqlalchemy import Column, Integer, String, DateTime
from ...infrastructure.databases.base import Base
from datetime import datetime

class Faculty(Base):
    __tablename__ = "faculties"

    faculty_id = Column(Integer, primary_key=True, index=True)
    faculty_code = Column(String(50), nullable=False, unique=True)
    faculty_name = Column(String(255), nullable=False)

    status = Column(String(50), nullable=False, default="ACTIVE")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
