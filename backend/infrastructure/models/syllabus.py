from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.sql import func
from sqlalchemy.dialects.mssql import NVARCHAR

from backend.infrastructure.databases.base import Base


class Syllabus(Base):
    __tablename__ = "syllabus"

    syllabus_id = Column(Integer, primary_key=True, index=True)

    # ===== NVARCHAR =====
    course_code = Column(NVARCHAR(50), nullable=False)
    course_name = Column(NVARCHAR(255), nullable=False)

    credits = Column(Integer, nullable=False)

    status = Column(NVARCHAR(50), nullable=False, default="DRAFT")
    created_by = Column(Integer, nullable=False)

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
