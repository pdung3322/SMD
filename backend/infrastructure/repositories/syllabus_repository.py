from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_
from backend.infrastructure.models.syllabus import Syllabus
from backend.infrastructure.models.syllabus_version import SyllabusVersion
from backend.infrastructure.models.approval_workflow import ApprovalWorkflow
from typing import List, Optional

class SyllabusRepository:
    """
    Repository để quản lý Syllabus
    Tách logic DB ra khỏi service
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_pending_for_hod(self, hod_id: int) -> List[Syllabus]:
        """
        Lấy danh sách giáo trình đang chờ HOD duyệt
        
        Query: JOIN Syllabus với ApprovalWorkflow
               WHERE reviewer_id = hod_id AND role = HOD AND status = PENDING
               AND syllabus.status = PENDING_HOD_REVIEW
        """
        syllabi = (
            self.db.query(Syllabus)
            .join(ApprovalWorkflow)
            .filter(
                and_(
                    ApprovalWorkflow.reviewer_id == hod_id,
                    ApprovalWorkflow.reviewer_role == "HOD",
                    ApprovalWorkflow.status == "PENDING",
                    Syllabus.status.in_(["PENDING_HOD_REVIEW", "COLLABORATIVE_REVIEW"])
                )
            )
            .options(
                joinedload(Syllabus.creator),
                joinedload(Syllabus.versions),
                joinedload(Syllabus.workflows),
            )
            .distinct()
            .all()
        )
        return syllabi
    
    def get_by_id(self, syllabus_id: int) -> Optional[Syllabus]:
        """
        Lấy 1 syllabus theo ID
        Eager-load: creator, versions, workflows, comments
        """
        syllabus = (
            self.db.query(Syllabus)
            .filter(Syllabus.syllabus_id == syllabus_id)
            .options(
                joinedload(Syllabus.creator),
                joinedload(Syllabus.versions),
                joinedload(Syllabus.workflows).joinedload(ApprovalWorkflow.reviewer),
                joinedload(Syllabus.comments),
            )
            .first()
        )
        return syllabus
    
    def update_status(self, syllabus_id: int, new_status: str) -> None:
        """
        Cập nhật trạng thái syllabus
        """
        syllabus = self.db.query(Syllabus).filter(
            Syllabus.syllabus_id == syllabus_id
        ).first()
        
        if syllabus:
            syllabus.status = new_status
            from datetime import datetime
            syllabus.updated_at = datetime.utcnow()
            self.db.commit()

    def list_all(self) -> List[Syllabus]:
        """
        Lấy toàn bộ syllabus (dùng cho tra cứu/so sánh)
        """
        syllabi = (
            self.db.query(Syllabus)
            .options(
                joinedload(Syllabus.creator),
                joinedload(Syllabus.versions),
            )
            .order_by(Syllabus.updated_at.desc())
            .all()
        )
        return syllabi

    def get_versions(self, syllabus_id: int) -> List[SyllabusVersion]:
        """
        Lấy danh sách phiên bản của 1 syllabus
        """
        versions = (
            self.db.query(SyllabusVersion)
            .filter(SyllabusVersion.syllabus_id == syllabus_id)
            .order_by(SyllabusVersion.version_number.desc())
            .all()
        )
        return versions