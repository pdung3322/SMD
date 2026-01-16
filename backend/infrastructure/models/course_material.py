from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.dialects.mssql import NVARCHAR
from backend.infrastructure.databases.base import Base
from datetime import datetime


class CourseMaterial(Base):
    __tablename__ = "course_materials"

    material_id = Column(Integer, primary_key=True, index=True)

    syllabus_id = Column(
        Integer,
        ForeignKey("syllabus.syllabus_id"),
        nullable=False
    )

    # Tên tài liệu (có tiếng Việt)
    title = Column(NVARCHAR(255), nullable=False)

    # Đường dẫn file (có thể chứa Unicode)
    file_path = Column(NVARCHAR(500), nullable=False)

    # Loại file: pdf, docx, pptx...
    file_type = Column(String(50))

    # Người upload
    uploaded_by = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False
    )

    # Thời gian upload
    uploaded_at = Column(DateTime, default=datetime.utcnow)
