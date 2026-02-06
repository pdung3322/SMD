from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext

from backend.infrastructure.databases.database import SessionLocal
from backend.infrastructure.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])

# ===== PASSWORD HASH CONFIG =====
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Hash password bằng bcrypt
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password plain text với password đã hash
    """
    return pwd_context.verify(plain_password, hashed_password)


# ===== Pydantic schemas =====
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
@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    # 1. Tìm user theo email
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Sai email hoặc mật khẩu"
        )

    # 2. Check status
    if user.status != "active":
        raise HTTPException(
            status_code=403,
            detail="Tài khoản đã bị khóa"
        )

    # 3. Verify password (HASH)
    if not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=401,
            detail="Sai email hoặc mật khẩu"
        )

    # 4. Login thành công
    return {
        "user_id": user.user_id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role
    }
    