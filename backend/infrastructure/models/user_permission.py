from sqlalchemy import Column, Integer, String, ForeignKey
from backend.infrastructure.databases.base import Base

class UserPermission(Base):
    __tablename__ = "user_permissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    module = Column(String(50), nullable=False)
    action = Column(String(50), nullable=False)
