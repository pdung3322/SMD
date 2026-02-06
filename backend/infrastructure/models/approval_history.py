from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from ...infrastructure.databases.base import Base
from datetime import datetime

class ApprovalHistory(Base):
    __tablename__ = "approval_histories"

    history_id = Column(Integer, primary_key=True, index=True)

    syllabus_id = Column(
        Integer,
        ForeignKey("syllabus.syllabus_id"),
        nullable=False
    )

    approved_by = Column(String(100), nullable=False)
    approval_date = Column(DateTime, default=datetime.utcnow)
    comment = Column(String(500))
