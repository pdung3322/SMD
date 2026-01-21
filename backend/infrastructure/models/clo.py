from sqlalchemy import Column, Integer, String, ForeignKey
from ...infrastructure.databases.base import Base

class CLO(Base):
    __tablename__ = "clos"

    clo_id = Column(Integer, primary_key=True, index=True)

    syllabus_version_id = Column(
        Integer,
        ForeignKey("syllabus_versions.version_id"),
        nullable=False
    )

    code = Column(String(20), nullable=False)     # CLO1, CLO2...
    description = Column(String(500), nullable=False)
