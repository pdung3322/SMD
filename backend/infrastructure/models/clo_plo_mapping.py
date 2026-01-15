from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from backend.infrastructure.databases.base import Base

class CLOPLOMapping(Base):
    __tablename__ = "clo_plo_mapping"

    id = Column(Integer, primary_key=True)

    clo_id = Column(
        Integer,
        ForeignKey("clos.clo_id"),
        nullable=False
    )

    plo_id = Column(
        Integer,
        ForeignKey("plos.plo_id"),
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint("clo_id", "plo_id", name="uq_clo_plo"),
    )
