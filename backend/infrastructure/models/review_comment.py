from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from ...infrastructure.databases.base import Base
from datetime import datetime

class ReviewComment(Base):
    __tablename__ = "review_comments"

    comment_id = Column(Integer, primary_key=True, index=True)

    syllabus_id = Column(Integer, ForeignKey("syllabus.syllabus_id"), nullable=False)
    version_id = Column(Integer, ForeignKey("syllabus_versions.version_id"), nullable=False)

    reviewer_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    reviewer_role = Column(String(50), nullable=False)

    content = Column(Text, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
