from sqlalchemy import Column, Integer, ForeignKey, NVARCHAR
from backend.infrastructure.databases.base import Base


class LecturerProfile(Base):
    __tablename__ = "lecturer_profiles"

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        primary_key=True,
        index=True
    )

    lecturer_code = Column(NVARCHAR(20), unique=True, nullable=False)  # Mã GV
