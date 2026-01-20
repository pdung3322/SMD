from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from ..databases.base import Base
from datetime import datetime

class AuditLog(Base):
    __tablename__ = "audit_logs"

    log_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)

    action = Column(String(100), nullable=False)
    target = Column(String(100), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
