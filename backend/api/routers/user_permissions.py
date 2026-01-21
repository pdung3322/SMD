from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, RootModel
from typing import Dict, List



from backend.infrastructure.databases.database import SessionLocal
from backend.infrastructure.models.user_permission import UserPermission
from backend.infrastructure.models.user import User

router = APIRouter(
    prefix="/user-permissions",
    tags=["User Permissions"]
)

# ================= DB =================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================= SCHEMA =================
class UserPermissionPayload(BaseModel):
    permissions: Dict[str, List[str]]

class UserPermissionResponse(RootModel[Dict[str, List[str]]]):
    pass

# ================= GET PERMISSIONS =================
@router.get(
    "/{user_id}",
    response_model=UserPermissionResponse
)
def get_user_permissions(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    rows = db.query(UserPermission).filter(
        UserPermission.user_id == user_id
    ).all()

    result: Dict[str, List[str]] = {}

    for r in rows:
        if not r.module or not r.action:
            continue

        result.setdefault(r.module, [])
        if r.action not in result[r.module]:
            result[r.module].append(r.action)

    return result


# ================= SAVE PERMISSIONS =================
@router.post("/{user_id}")
def save_user_permissions(
    user_id: int,
    payload: UserPermissionPayload,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.query(UserPermission).filter(
        UserPermission.user_id == user_id
    ).delete()

    for module, actions in payload.permissions.items():
        for action in actions:
            db.add(UserPermission(
                user_id=user_id,
                module=module,
                action=action
            ))

    db.commit()
    return {"message": "Saved user permissions"}
