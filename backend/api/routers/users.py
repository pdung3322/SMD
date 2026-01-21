from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

import pandas as pd
from io import BytesIO

from passlib.context import CryptContext

from backend.infrastructure.databases.database import SessionLocal
from backend.infrastructure.models.user import User

# ================= CONFIG =================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

VALID_ROLES = {
    "ADMIN": "Quản trị hệ thống",
    "HOD": "Trưởng bộ môn",
    "LECTURER": "Giảng viên",
    "AA": "Phòng đào tạo",
    "PRINCIPAL": "Ban giám hiệu",
    "STUDENT": "Sinh viên",
}

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# ================= SCHEMAS =================
class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: str
    mobile: Optional[str]
    role: str
    status: str

    class Config:
        from_attributes = True   # chuẩn pydantic v2


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
@router.post("/create")
def create_user(
    data: UserCreateRequest,
    db: Session = Depends(get_db)
):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    if data.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail="Invalid role")

    user = User(
        full_name=data.full_name,
        email=data.email,
        password=hash_password(data.password),
        mobile=data.mobile,
        role=data.role,
        status="active"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User created successfully",
        "user_id": user.user_id
    }

# ================= IMPORT USERS =================
@router.post("/import")
async def import_users(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    filename = file.filename.lower()
    contents = await file.read()

    try:
        if filename.endswith(".xlsx"):
            df = pd.read_excel(BytesIO(contents))

        elif filename.endswith(".csv"):
            try:
                df = pd.read_csv(
                    BytesIO(contents),
                    sep=None,
                    engine="python",
                    encoding="utf-8"
                )
            except UnicodeDecodeError:
                df = pd.read_csv(
                    BytesIO(contents),
                    sep=None,
                    engine="python",
                    encoding="cp1258"  # chuẩn tiếng Việt Windows
                )

        else:
            raise HTTPException(
                status_code=400,
                detail="Only .xlsx or .csv file is supported"
            )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot read file. Please check file format. {str(e)}"
        )


    # ===== GIỮ NGUYÊN PHẦN DƯỚI =====

    required_columns = ["full_name", "email", "password", "role"]
    for col in required_columns:
        if col not in df.columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required column: {col}"
            )

    success_count = 0
    error_rows = []

    for index, row in df.iterrows():
        try:
            if pd.isna(row["full_name"]) or pd.isna(row["email"]):
                raise ValueError("Missing full_name or email")

            if db.query(User).filter(User.email == row["email"]).first():
                raise ValueError("Email already exists")

            if row["role"] not in VALID_ROLES:
                raise ValueError("Invalid role")

            user = User(
                full_name=str(row["full_name"]).strip(),
                email=str(row["email"]).strip(),
                password=hash_password(str(row["password"])),
                mobile=str(row["mobile"]).strip()
                if "mobile" in df.columns and not pd.isna(row.get("mobile"))
                else None,
                role=row["role"],
                status="active"
            )

            db.add(user)
            db.flush()
            success_count += 1

        except Exception as e:
            error_rows.append({
                "row": index + 2,
                "email": row.get("email"),
                "error": str(e)
            })

    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Import failed while saving data"
        )

    return {
        "message": "Import completed",
        "success": success_count,
        "failed": len(error_rows),
        "errors": error_rows
    }

# ================= ROLES =================
@router.get("/roles")
def get_user_roles():
    return [
        {"key": key, "label": label}
        for key, label in VALID_ROLES.items()
    ]

# ================= GET USERS =================
@router.get("", response_model=List[UserResponse])
def get_users(
    role: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    return query.all()

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

    if data.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail="Invalid role")

    user.full_name = data.full_name
    user.email = data.email
    user.mobile = data.mobile
    user.role = data.role

    if data.password:
        user.password = hash_password(data.password)

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
