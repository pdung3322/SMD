from sqlalchemy import Column, Integer, String, Date, Boolean
from backend.infrastructure.databases.base import Base

class AcademicYear(Base):
    __tablename__ = "academic_years"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(20), nullable=False)        # 2025-2026
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    is_active = Column(Boolean, default=False)
    is_closed = Column(Boolean, default=False)
