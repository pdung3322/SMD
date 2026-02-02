from sqlalchemy import Column, Integer, ForeignKey, NVARCHAR
from backend.infrastructure.databases.base import Base


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        primary_key=True,
        index=True
    )

    student_code = Column(NVARCHAR(20), unique=True, nullable=False)
    cohort = Column(NVARCHAR(10), nullable=True)

    faculty = Column(NVARCHAR(255), nullable=True)
    major = Column(NVARCHAR(255), nullable=True)
    specialization = Column(NVARCHAR(255), nullable=True)

    degree_level = Column(NVARCHAR(50), nullable=True)
    training_type = Column(NVARCHAR(50), nullable=True)

    study_status = Column(NVARCHAR(50), nullable=True)  
