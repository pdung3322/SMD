from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os

from backend.infrastructure.databases.database import get_db
from backend.infrastructure.services.training_program_service import TrainingProgramService

router = APIRouter(
    prefix="/api/training-programs",
    tags=["Training Programs"]
)

@router.get("")
def get_training_programs(db: Session = Depends(get_db)):
    return TrainingProgramService.get_training_programs(db)

@router.get("/file")
def get_training_program_file(path: str):
    base_dir = os.path.abspath("backend/uploads")
    file_path = os.path.abspath(
        os.path.join(base_dir, path.replace("/uploads/", ""))
    )

    if not file_path.startswith(base_dir):
        raise HTTPException(status_code=403, detail="Access denied")

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail="Chương trình đào tạo chưa được cập nhật"
        )

    return FileResponse(
    file_path,
    media_type="application/pdf",
    headers={
        "Content-Disposition": f'inline; filename="{os.path.basename(file_path)}"'
    }
)
