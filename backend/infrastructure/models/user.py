from sqlalchemy import Column, Integer, String, ForeignKey
from ...infrastructure.databases.base import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    mobile = Column(String(20))

    role = Column(String(50), nullable=False)  
    # admin / lecturer / student / hod / aa / principal

    status = Column(String(50), nullable=False)
