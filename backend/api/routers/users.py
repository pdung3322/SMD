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

# ================= SCHEMAS =================
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


class UserStatusRequest(BaseModel):
    status: str

class UserCreateRequest(BaseModel):
    full_name: str
    email: str
    password: str
    mobile: Optional[str] = None
    role: str

# ================= DB DEPENDENCY =================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================= CREATE USER =================
@router.post("/")
def create_user(
    data: UserCreateRequest,
    db: Session = Depends(get_db)
):
    # check email tồn tại
    existed = db.query(User).filter(User.email == data.email).first()
    if existed:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        full_name=data.full_name,
        email=data.email,
        password=data.password,   # (sau này hash)
        mobile=data.mobile,
        role=data.role,
        status="active"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User created successfully"}

# ================= GET ALL USERS =================
@router.get("/", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


# ================= GET USER DETAIL =================
@router.get("/{user_id}", response_model=UserResponse)
def get_user_detail(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


# ================= UPDATE USER =================
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

    if data.password:
        user.password = data.password

    db.commit()
    return {"message": "User updated successfully"}


# ================= UPDATE USER STATUS =================
@router.patch("/{user_id}/status")
def update_user_status(
    user_id: int,
    data: UserStatusRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.user_id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.status not in ["active", "locked"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    user.status = data.status
    db.commit()

    return {"message": "User status updated successfully"}
