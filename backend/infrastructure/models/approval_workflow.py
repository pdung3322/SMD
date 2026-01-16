from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ...infrastructure.databases.base import Base
from datetime import datetime

class ApprovalWorkflow(Base):
    __tablename__ = "approval_workflows"

    workflow_id = Column(Integer, primary_key=True, index=True)

    syllabus_id = Column(Integer, ForeignKey("syllabus.syllabus_id"), nullable=False)

    reviewer_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    reviewer_role = Column(String(50), nullable=False)

    step_order = Column(Integer, nullable=False)

    status = Column(String(50), nullable=False, default="PENDING")
    comment = Column(String(500))
    reviewed_at = Column(DateTime, default=None)

        # ===== RELATIONSHIPS =====
    syllabus = relationship("Syllabus", back_populates="workflows")
    reviewer = relationship("User")

