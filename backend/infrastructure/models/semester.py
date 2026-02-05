from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
from backend.infrastructure.databases.base import Base
from sqlalchemy import Column, Boolean



class Semester(Base):
    __tablename__ = "semesters"

    id = Column(Integer, primary_key=True, index=True)
    academic_year_id = Column(Integer, ForeignKey("academic_years.id"))

    code = Column(String(10))      # HK1, HK2, HK_HE
    name = Column(String(50))
    start_date = Column(Date)
    end_date = Column(Date)

    is_optional = Column(Boolean, default=False)
    is_active = Column(Boolean, default=False)
    is_current = Column(Boolean, default=False)