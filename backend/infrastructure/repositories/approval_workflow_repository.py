from sqlalchemy.orm import Session
from sqlalchemy import and_
from backend.infrastructure.models.approval_workflow import ApprovalWorkflow
from typing import Optional
from datetime import datetime


class ApprovalWorkflowRepository:
    """
    Repository để quản lý quy trình duyệt
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_pending_workflow(
        self, 
        syllabus_id: int, 
        reviewer_id: int, 
        reviewer_role: str = "HOD"
    ) -> Optional[ApprovalWorkflow]:
        """
        Lấy workflow PENDING cho reviewer
        Dùng để kiểm tra trước khi cập nhật
        """
        workflow = (
            self.db.query(ApprovalWorkflow)
            .filter(
                and_(
                    ApprovalWorkflow.syllabus_id == syllabus_id,
                    ApprovalWorkflow.reviewer_id == reviewer_id,
                    ApprovalWorkflow.reviewer_role == reviewer_role,
                    ApprovalWorkflow.status == "PENDING"
                )
            )
            .first()
        )
        return workflow
    
    def update_status(
        self,
        workflow_id: int,
        new_status: str,
        comment: str = None
    ) -> None:
        """
        Cập nhật trạng thái workflow
        """
        workflow = self.db.query(ApprovalWorkflow).filter(
            ApprovalWorkflow.workflow_id == workflow_id
        ).first()
        
        if workflow:
            workflow.status = new_status
            workflow.comment = comment
            workflow.reviewed_at = datetime.utcnow()
            self.db.commit()
    
    def get_workflows_by_syllabus(
        self, 
        syllabus_id: int
    ) -> list:
        """
        Lấy tất cả workflows của 1 syllabus (lịch sử duyệt)
        """
        workflows = (
            self.db.query(ApprovalWorkflow)
            .filter(ApprovalWorkflow.syllabus_id == syllabus_id)
            .order_by(ApprovalWorkflow.step_order)
            .all()
        )
        return workflows

    def create_workflow(
        self,
        syllabus_id: int,
        reviewer_id: int,
        reviewer_role: str,
        step_order: int,
        status: str = "PENDING"
    ) -> ApprovalWorkflow:
        """
        Tạo workflow mới cho syllabus
        """
        workflow = ApprovalWorkflow(
            syllabus_id=syllabus_id,
            reviewer_id=reviewer_id,
            reviewer_role=reviewer_role,
            step_order=step_order,
            status=status
        )
        self.db.add(workflow)
        self.db.flush()
        return workflow