from sqlalchemy import Column, Integer, String
from ...infrastructure.databases.base import Base

class Role(Base):
    __tablename__ = "roles"

    role_id = Column(Integer, primary_key=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)

