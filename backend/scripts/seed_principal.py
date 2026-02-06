from backend.infrastructure.databases.database import SessionLocal
from backend.infrastructure.models.user import User
from backend.infrastructure.models.syllabus import Syllabus
from backend.infrastructure.models.approval_workflow import ApprovalWorkflow
from datetime import datetime


def seed():
    db = SessionLocal()
    try:
        # 1) Ensure a PRINCIPAL user exists
        principal = db.query(User).filter(User.role == "PRINCIPAL").first()
        if not principal:
            principal = User(
                full_name="Seed Principal",
                email="principal@seed.local",
                password="123456",
                role="PRINCIPAL",
                status="active"
            )
            db.add(principal)
            db.commit()
            db.refresh(principal)
            print(f"Created principal user id={principal.user_id}")
        else:
            print(f"Found principal user id={principal.user_id}")

        # 2) Create a syllabus if not exists
        course_code = "Viện công nghệ thông tin và Điện, điện tử"
        syllabus = db.query(Syllabus).filter(Syllabus.course_code == course_code).first()
        if not syllabus:
            syllabus = Syllabus(
                course_code=course_code,
                course_name="CTRR - Cấu trúc rời rạc",
                credits=3,
                description="Auto-generated test syllabus.",
                created_by=principal.user_id,
                status="SUBMITTED",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.add(syllabus)
            db.commit()
            db.refresh(syllabus)
            print(f"Created syllabus id={syllabus.syllabus_id}")
        else:
            print(f"Found syllabus id={syllabus.syllabus_id}")

        # 3) Create approval workflow for principal review if not exists
        wf = (
            db.query(ApprovalWorkflow)
            .filter(
                ApprovalWorkflow.syllabus_id == syllabus.syllabus_id,
                ApprovalWorkflow.reviewer_role == "PRINCIPAL"
            )
            .first()
        )

        if not wf:
            wf = ApprovalWorkflow(
                syllabus_id=syllabus.syllabus_id,
                reviewer_id=principal.user_id,
                reviewer_role="PRINCIPAL",
                step_order=1,
                status="PENDING",
                comment=None
            )
            db.add(wf)
            db.commit()
            db.refresh(wf)
            print(f"Created approval workflow id={wf.workflow_id}")
        else:
            print(f"Found approval workflow id={wf.workflow_id} (status={wf.status})")

    finally:
        db.close()


if __name__ == "__main__":
    seed()