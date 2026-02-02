import os, shutil
from typing import List
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
from backend.infrastructure.models.syllabus import Syllabus
from backend.infrastructure.models.syllabus_version import SyllabusVersion
from backend.infrastructure.models.syllabus_file import SyllabusFile
from backend.infrastructure.repositories.syllabus_repository import SyllabusRepository

class SyllabusService:
    def __init__(self):
        self.repo = SyllabusRepository()

    def get_all(self, db: Session):
        return self.repo.get_all(db)

    def get_by_id(self, db: Session, syllabus_id: int):
        return self.repo.get_by_id(db, syllabus_id)

def create_syllabus(self, db: Session, course_code: str, course_name: str,
                    credits: int, files: List[UploadFile], created_by: int = 1):
    if not files:
        raise HTTPException(status_code=400, detail="At least one file is required")

    syllabus = Syllabus(
        course_code=course_code,
        course_name=course_name,
        credits=credits,
        status="DRAFT",
        created_by=created_by,
    )
    self.repo.create_syllabus(db, syllabus)

    version = SyllabusVersion(
        syllabus_id=syllabus.syllabus_id,
        version_number=1,
        created_by=created_by,
    )
    self.repo.create_version(db, version)
    db.flush()  # đảm bảo version_id có giá trị

    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)

    for f in files:
        file_path = os.path.join(upload_dir, f.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(f.file, buffer)

        syllabus_file = SyllabusFile(
            version_id=version.version_id,
            file_name=f.filename,
            file_path=file_path,
            file_size=os.path.getsize(file_path),
        )
        db.add(syllabus_file)

    db.commit()
    db.refresh(syllabus)

    return {
        "syllabus_id": syllabus.syllabus_id,
        "course_code": syllabus.course_code,
        "course_name": syllabus.course_name,
        "credits": syllabus.credits,
        "status": syllabus.status,
        "message": "Tạo giáo trình thành công",
    }

    def submit_syllabus(self, db: Session, syllabus_id: int):
        syllabus = self.repo.get_by_id(db, syllabus_id)
        if not syllabus:
            raise HTTPException(status_code=404, detail="Syllabus not found")
        if syllabus.status != "DRAFT":
            raise HTTPException(status_code=400, detail="Chỉ giáo trình ở trạng thái DRAFT mới được gửi phê duyệt")

        syllabus.status = "PENDING_REVIEW"
        db.commit()
        return {"message": "Giáo trình đã được gửi phê duyệt", "status": syllabus.status}

syllabus_service = SyllabusService()
