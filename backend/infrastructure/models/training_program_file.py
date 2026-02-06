from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.dialects.mssql import NVARCHAR
from backend.infrastructure.databases.base import Base
from datetime import datetime


class TrainingProgramFile(Base):
    __tablename__ = "training_program_files"

    program_id = Column(Integer, primary_key=True, index=True)

    specialization_id = Column(
        Integer,
        ForeignKey("specializations.specialization_id"),
        nullable=False
    )

    academic_year = Column(String(50), nullable=False)

    file_name = Column(NVARCHAR(255), nullable=False)
    file_path = Column(String(500), nullable=False)

    status = Column(String(50), nullable=False, default="ACTIVE")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
