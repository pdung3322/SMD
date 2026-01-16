from sqlalchemy import Column, Integer, String
from backend.infrastructure.databases.base import Base

class RolePermission(Base):
    __tablename__ = "role_permissions"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(50), nullable=False)
    module = Column(String(50), nullable=False)
    action = Column(String(50), nullable=False)
