from sqlalchemy import Column, Integer, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from backend.infrastructure.databases.base import Base
from datetime import datetime

class SyllabusVersion(Base):
    __tablename__ = "syllabus_versions"

    version_id = Column(Integer, primary_key=True, index=True)

    syllabus_id = Column(
        Integer,
        ForeignKey("syllabus.syllabus_id", ondelete="CASCADE"),
        nullable=False
    )

    version_number = Column(Integer, nullable=False)
    note = Column(Text, nullable=True)

    created_by = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False
    )

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    syllabus = relationship(
        "Syllabus",
        back_populates="versions"
    )

    # ✅ DÙNG STRING — KHÔNG IMPORT
    files = relationship(
        "SyllabusFile",
        back_populates="version",
        cascade="all, delete-orphan",
        lazy="selectin"
    )
