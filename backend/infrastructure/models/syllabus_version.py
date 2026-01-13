from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from ...infrastructure.databases.base import Base
from datetime import datetime

class SyllabusVersion(Base):
    __tablename__ = "syllabus_versions"

    version_id = Column(Integer, primary_key=True, index=True)

    syllabus_id = Column(Integer, ForeignKey("syllabus.syllabus_id"), nullable=False)

    version_number = Column(Integer, nullable=False)

    content = Column(Text, nullable=False)

    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

