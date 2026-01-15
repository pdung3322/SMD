from sqlalchemy import Column, Integer, String
from backend.infrastructure.databases.base import Base


class PLO(Base):
    __tablename__ = "plos"

    plo_id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), nullable=False, unique=True)   # PLO1, PLO2...
    description = Column(String(500), nullable=False)
