from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.infrastructure.databases.base import Base
from datetime import datetime

class SyllabusFile(Base):
    __tablename__ = "syllabus_files"

    file_id = Column(Integer, primary_key=True, index=True)

    version_id = Column(
        Integer,
        ForeignKey(
            "syllabus_versions.version_id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=True)

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    # relationship
    version = relationship(
        "SyllabusVersion",
        backref="files"
    )
