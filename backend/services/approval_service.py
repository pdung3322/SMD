from sqlalchemy.orm import Session
from backend.infrastructure.repositories.syllabus_repository import SyllabusRepository
from backend.infrastructure.repositories.approval_workflow_repository import ApprovalWorkflowRepository
from backend.infrastructure.repositories.review_comment_repository import ReviewCommentRepository
from backend.infrastructure.models.syllabus_version import SyllabusVersion
from backend.api.schemas.syllabus import (
    SyllabusPendingItem,
    SyllabusDetail,
    ApprovalHistoryItem,
    ReviewCommentItem,
    ReviewSubmitResponse
)
from typing import List, Optional
from fastapi import HTTPException
from datetime import datetime

class ApprovalService:
    """
    Service xử lý logic duyệt cho HOD/AA/PRINCIPAL
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.syllabus_repo = SyllabusRepository(db)
        self.workflow_repo = ApprovalWorkflowRepository(db)
        self.comment_repo = ReviewCommentRepository(db)

    
    def list_pending_for_hod(self, hod_id: int) -> List[SyllabusPendingItem]:
        """
        Lấy danh sách đề cương đang chờ HOD duyệt
        
        Status mapping:
        - Nếu syllabus.status = "PENDING" → UI status = "pending_approval" (chờ HOD duyệt)
        - Nếu syllabus.status = "COLLABORATIVE_REVIEW" → UI status = "pending_review" (chờ phản biện)
        """
        syllabi = self.syllabus_repo.get_pending_for_hod(hod_id)
        
        result = []
        for s in syllabi:
            # Lấy phiên bản mới nhất
            latest_version = (
                self.db.query(SyllabusVersion)
                .filter(SyllabusVersion.syllabus_id == s.syllabus_id)
                .order_by(SyllabusVersion.version_number.desc())
                .first()
            )
            
            # MAP trạng thái từ DB sang UI
            ui_status = "pending_approval"  # Default: chờ HOD duyệt
            if s.status == "COLLABORATIVE_REVIEW":
                ui_status = "pending_review"  # Chờ phản biện
            elif s.status == "APPROVED_BY_HOD":
                ui_status = "approved"
            elif s.status == "REJECTED_BY_HOD":
                ui_status = "rejected"
            
            item = SyllabusPendingItem(
                syllabus_id=s.syllabus_id,
                course_code=s.course_code,
                course_name=s.course_name,
                lecturer_name=s.creator.full_name if s.creator else "N/A",
                submitted_date=s.created_at,
                status=ui_status,  # ← Dùng UI status đã map
                current_version=f"v{latest_version.version_number}" if latest_version else "v0"
            )
            result.append(item)
        
        return result

    def get_syllabus_detail(self, syllabus_id: int) -> SyllabusDetail:
        """
        Lấy chi tiết đề cương để HOD duyệt
        
        Logic:
        1. Lấy syllabus từ repo (eager-load)
        2. Lấy phiên bản mới nhất
        3. Lấy lịch sử duyệt (workflows)
        4. Lấy comments
        5. Map ra DTO SyllabusDetail
        """
        syllabus = self.syllabus_repo.get_by_id(syllabus_id)
        
        if not syllabus:
            raise HTTPException(status_code=404, detail="Syllabus not found")
        
        # Phiên bản mới nhất
        latest_version = (
            self.db.query(SyllabusVersion)
            .filter(SyllabusVersion.syllabus_id == syllabus_id)
            .order_by(SyllabusVersion.version_number.desc())
            .first()
        )

        if not latest_version:
            raise HTTPException(status_code=404, detail="No version found")
        
        # Lịch sử duyệt
        workflows = self.workflow_repo.get_workflows_by_syllabus(syllabus_id)
        approval_history = [
            ApprovalHistoryItem(
                workflow_id=w.workflow_id,
                reviewer_name=w.reviewer.full_name if w.reviewer else "N/A",
                reviewer_role=w.reviewer_role,
                status=w.status,
                comment=w.comment,
                reviewed_at=w.reviewed_at
            )
            for w in workflows
        ]
        
        # Comments
        comments = self.comment_repo.get_comments_by_syllabus(syllabus_id)
        review_comments = [
            ReviewCommentItem(
                comment_id=c.comment_id,
                reviewer_name=c.reviewer.full_name if c.reviewer else "N/A",
                reviewer_role=c.reviewer_role,
                content=c.content,
                created_at=c.created_at
            )
            for c in comments
        ]

        # Tổng hợp thành DTO
        detail = SyllabusDetail(
            syllabus_id=syllabus.syllabus_id,
            course_code=syllabus.course_code,
            course_name=syllabus.course_name,
            credits=syllabus.credits,
            description=syllabus.description,
            content=latest_version.content,
            current_version=f"v{latest_version.version_number}",
            lecturer_name=syllabus.creator.full_name if syllabus.creator else "N/A",
            lecturer_id=syllabus.created_by,
            approval_history=approval_history,
            review_comments=review_comments
        )
        
        return detail
    
    def submit_hod_review(
        self,
        syllabus_id: int,
        hod_id: int,
        decision: str,
        feedback: Optional[str] = None
    ) -> ReviewSubmitResponse:
        """
        HOD submit quyết định duyệt/từ chối/yêu cầu chỉnh sửa
        
        Logic:
        1. Kiểm tra workflow PENDING cho HOD
        2. Cập nhật workflow status
        3. Cập nhật syllabus status dựa trên quyết định
        4. Lưu comment
        5. Trả về response

        Decision mapping:
        - APPROVED → syllabus status = APPROVED_BY_HOD (chuyển sang AA)
        - REJECTED → syllabus status = REJECTED_BY_HOD
        - REVISION → syllabus status = REVISION_REQUESTED_BY_HOD
        """
        # Kiểm tra workflow PENDING
        workflow = self.workflow_repo.get_pending_workflow(
            syllabus_id, hod_id, "HOD"
        )
        
        if not workflow:
            raise HTTPException(
                status_code=404,
                detail="No pending workflow found for this HOD"
            )
        
        # Cập nhật workflow
        self.workflow_repo.update_status(
            workflow.workflow_id,
            decision,
            feedback
        )
        
        # Cập nhật syllabus status
        status_mapping = {
            "APPROVED": "APPROVED_BY_HOD",
            "REJECTED": "REJECTED_BY_HOD",
            "REVISION": "REVISION_REQUESTED_BY_HOD"
        }
        new_syllabus_status = status_mapping.get(decision, "PENDING")
        self.syllabus_repo.update_status(syllabus_id, new_syllabus_status)

        # Lưu comment nếu có feedback
        if feedback:
            latest_version = (
                self.db.query(SyllabusVersion)
                .filter(SyllabusVersion.syllabus_id == syllabus_id)
                .order_by(SyllabusVersion.version_number.desc())
                .first()
            )
            
            if latest_version:
                self.comment_repo.add_comment(
                    syllabus_id=syllabus_id,
                    version_id=latest_version.version_id,
                    reviewer_id=hod_id,
                    reviewer_role="HOD",
                    content=feedback
                )
        
        return ReviewSubmitResponse(
            message="HOD review submitted successfully",
            workflow_id=workflow.workflow_id,
            syllabus_id=syllabus_id,
            new_status=new_syllabus_status
        )