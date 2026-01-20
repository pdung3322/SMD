from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.infrastructure.databases.database import SessionLocal
from backend.infrastructure.models.user import User
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])


# ===== Pydantic schema =====
class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    user_id: int
    full_name: str
    email: str
    role: str


# ===== DB dependency =====
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ===== Login API =====
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = (
        db.query(User)
        .filter(
            User.email == data.email,
            User.password == data.password,
            User.status == "active"
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Sai email hoặc mật khẩu"
        )

    return {
        "user": {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }
    }
