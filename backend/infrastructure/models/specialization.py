from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.dialects.mssql import NVARCHAR
from backend.infrastructure.databases.base import Base
from datetime import datetime


class Specialization(Base):
    __tablename__ = "specializations"

    specialization_id = Column(Integer, primary_key=True, index=True)

    specialization_name = Column(NVARCHAR(255), nullable=False)
    major_name = Column(NVARCHAR(255), nullable=False)

    status = Column(String(50), nullable=False, default="ACTIVE")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
