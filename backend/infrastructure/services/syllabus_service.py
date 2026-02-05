import os, shutil
from typing import List
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
from backend.infrastructure.models.syllabus import Syllabus
from backend.infrastructure.models.syllabus_version import SyllabusVersion
from backend.infrastructure.models.syllabus_file import SyllabusFile
from backend.infrastructure.models.user import User
from backend.infrastructure.repositories.syllabus_repository import SyllabusRepository
from backend.infrastructure.repositories.approval_workflow_repository import ApprovalWorkflowRepository
from backend.infrastructure.services.pdf_extractor import extract_text_from_pdf

class SyllabusService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = SyllabusRepository(db)
        self.workflow_repo = ApprovalWorkflowRepository(db)

    def get_all(self):
        return self.repo.list_all()

    def get_by_id(self, syllabus_id: int):
        return self.repo.get_by_id(syllabus_id)

    def create_syllabus(self, course_code: str, course_name: str,
                        credits: int, files: List[UploadFile], created_by: int = 1):
        if not files:
            raise HTTPException(status_code=400, detail="At least one file is required")

        # Ensure created_by exists; fallback to first active lecturer
        creator = self.db.query(User).filter(User.user_id == created_by).first()
        if not creator:
            creator = (
                self.db.query(User)
                .filter(User.role == "LECTURER", User.status == "active")
                .first()
            )
        if not creator:
            raise HTTPException(status_code=400, detail="Không tìm thấy giảng viên hợp lệ để tạo giáo trình")

        syllabus = Syllabus(
            course_code=course_code,
            course_name=course_name,
            credits=credits,
            status="DRAFT",
            created_by=creator.user_id,
        )
        self.db.add(syllabus)
        self.db.flush()  # đảm bảo syllabus_id có giá trị

        version = SyllabusVersion(
            syllabus_id=syllabus.syllabus_id,
            version_number=1,
            content="",  # required by DB schema (non-null)
            created_by=creator.user_id,
        )
        self.db.add(version)
        self.db.flush()  # đảm bảo version_id có giá trị

        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)

        extracted_texts: List[str] = []

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
            self.db.add(syllabus_file)

            if f.filename.lower().endswith(".pdf"):
                try:
                    pdf_text = extract_text_from_pdf(file_path)
                    if pdf_text:
                        extracted_texts.append(f"### {f.filename}\n{pdf_text}")
                except Exception:
                    pass

        if extracted_texts:
            version.content = "\n\n".join(extracted_texts)
        else:
            version.content = ""

        self.db.commit()
        self.db.refresh(syllabus)

        return {
            "syllabus_id": syllabus.syllabus_id,
            "course_code": syllabus.course_code,
            "course_name": syllabus.course_name,
            "credits": syllabus.credits,
            "status": syllabus.status,
            "message": "Tạo giáo trình thành công",
        }

    def submit_syllabus(self, syllabus_id: int):
        syllabus = self.repo.get_by_id(syllabus_id)
        if not syllabus:
            raise HTTPException(status_code=404, detail="Syllabus not found")
        if syllabus.status != "DRAFT":
            raise HTTPException(status_code=400, detail="Chỉ giáo trình ở trạng thái DRAFT mới được gửi phê duyệt")

        hod_user = (
            self.db.query(User)
            .filter(User.role == "HOD", User.status == "active")
            .first()
        )

        if not hod_user:
            raise HTTPException(status_code=400, detail="Không tìm thấy HOD để gửi duyệt")

        existing = self.workflow_repo.get_pending_workflow(
            syllabus_id=syllabus_id,
            reviewer_id=hod_user.user_id,
            reviewer_role="HOD"
        )

        if not existing:
            self.workflow_repo.create_workflow(
                syllabus_id=syllabus_id,
                reviewer_id=hod_user.user_id,
                reviewer_role="HOD",
                step_order=1,
                status="PENDING"
            )

        syllabus.status = "PENDING_HOD_REVIEW"
        self.db.commit()

        return {
            "message": "Giáo trình đã được gửi phê duyệt",
            "status": syllabus.status,
            "hod_id": hod_user.user_id
        }
