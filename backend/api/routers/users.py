from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from backend.infrastructure.databases.database import SessionLocal
from backend.infrastructure.models.user import User

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# ===== Schemas =====
class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: str
    role: str
    status: str

    class Config:
        orm_mode = True


class UserUpdateRequest(BaseModel):
    full_name: str
    email: str
    mobile: Optional[str] = None
    role: str
    password: Optional[str] = None


# ===== DB dependency =====
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ===== GET ALL USERS =====
@router.get("/", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

# ===== GET USER DETAIL =====
@router.get("/{user_id}", response_model=UserResponse)
def get_user_detail(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

# ===== UPDATE USER =====
@router.put("/{user_id}")
def update_user(
    user_id: int,
    data: UserUpdateRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.full_name = data.full_name
    user.email = data.email
    user.mobile = data.mobile
    user.role = data.role

    # 👉 Chỉ cập nhật password nếu có gửi
    if data.password:
        user.password = data.password

    db.commit()
    return {"message": "User updated successfully"}