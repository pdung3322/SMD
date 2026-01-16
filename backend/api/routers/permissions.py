from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.infrastructure.databases.database import SessionLocal
from backend.infrastructure.models.role_permission import RolePermission

router = APIRouter(prefix="/permissions", tags=["Permissions"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===== MODULE + ACTION (render bảng FE) =====
@router.get("/modules")
def get_modules():
    return [
        {
            "key": "USER",
            "name": "Quản lý người dùng",
            "actions": [
                {"key": "VIEW", "label": "Xem"},
                {"key": "CREATE", "label": "Tạo"},
                {"key": "UPDATE", "label": "Sửa"},
                {"key": "LOCK", "label": "Khóa"},
            ],
        },
        {
            "key": "SYLLABUS",
            "name": "Quản lý đề cương",
            "actions": [
                {"key": "VIEW", "label": "Xem"},
                {"key": "CREATE", "label": "Tạo"},
                {"key": "UPDATE", "label": "Chỉnh sửa"},
                {"key": "SUBMIT", "label": "Gửi duyệt"},
            ],
        },
        {
            "key": "REVIEW",
            "name": "Duyệt đề cương",
            "actions": [
                {"key": "VIEW", "label": "Xem"},
                {"key": "APPROVE", "label": "Duyệt"},
                {"key": "REJECT", "label": "Từ chối"},
            ],
        },
    ]

# ===== ROLE PERMISSION =====
@router.get("/roles/{role}")
def get_role_permissions(role: str, db: Session = Depends(get_db)):
    rows = db.query(RolePermission).filter(RolePermission.role == role).all()
    result = {}
    for r in rows:
        result.setdefault(r.module, []).append(r.action)
    return result

@router.post("/roles/{role}")
def save_role_permissions(role: str, payload: dict, db: Session = Depends(get_db)):
    db.query(RolePermission).filter(RolePermission.role == role).delete()

    for module, actions in payload["permissions"].items():
        for action in actions:
            db.add(RolePermission(
                role=role,
                module=module,
                action=action
            ))

    db.commit()
    return {"message": "Saved role permissions"}

# ===== ROLES LIST (for FE dropdown) =====
@router.get("/roles")
def get_roles():
    return [
        {"code": "ADMIN", "name": "Quản trị hệ thống"},
        {"code": "HOD", "name": "Trưởng bộ môn"},
        {"code": "LECTURER", "name": "Giảng viên"},
        {"code": "AA", "name": "Phòng đào tạo"},
        {"code": "PRINCIPAL", "name": "Ban giám hiệu"},
        {"code": "STUDENT", "name": "Sinh viên"},
    ]
