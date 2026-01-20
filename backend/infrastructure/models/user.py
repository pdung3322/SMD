from sqlalchemy import Column, Integer
from sqlalchemy.dialects.mssql import NVARCHAR
from ...infrastructure.databases.base import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)

    full_name = Column(NVARCHAR(255), nullable=False)
    email = Column(NVARCHAR(255), nullable=False, unique=True)
    password = Column(NVARCHAR(255), nullable=False)
    mobile = Column(NVARCHAR(20))

    role = Column(NVARCHAR(50), nullable=False)
    # ADMIN / LECTURER / STUDENT / HOD / AA / PRINCIPAL

    status = Column(NVARCHAR(50), nullable=False)
