from fastapi import APIRouter, Depends, HTTPException, Header
from typing import List, Optional, Any, Dict
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.infrastructure.databases.database import SessionLocal
from backend.infrastructure.models.syllabus import Syllabus
from backend.infrastructure.models.approval_workflow import ApprovalWorkflow
from backend.infrastructure.models.review_comment import ReviewComment
from backend.infrastructure.models.user import User
from backend.infrastructure.models.course import Course
from backend.infrastructure.models.faculty import Faculty
from datetime import datetime

router = APIRouter(prefix="/principal", tags=["Principal"])

# Pydantic schemas
class NotificationOut(BaseModel):
    syllabus_id: int
    course_code: str
    course_name: str
    submitted_date: Optional[str]
    status: str
    workflow_id: int

class ActionResponse(BaseModel):
    message: str
    syllabus_id: int

class PendingSyllabusOut(BaseModel):
    syllabus_id: int
    course_code: str
    course_name: str
    faculty_name: Optional[str]
    academic_year: Optional[str]
    status: str
    creator_name: Optional[str]
    aa_note: Optional[str]

class ApprovedSyllabusOut(BaseModel):
    syllabus_id: int
    course_code: str
    course_name: str
    faculty_name: Optional[str]
    creator_name: Optional[str]
    approved_date: Optional[str]
    status: str

class SyllabusDetailOut(BaseModel):
    syllabus_id: int
    course_code: str
    course_name: str
    credits: int
    description: Optional[str]
    academic_year: Optional[str]
    creator_name: Optional[str]
    aa_note: Optional[str]
    approval_timeline: List[Dict[str, Any]]

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Simple role check (dev): header X-User-Role and X-User-Id
def require_principal(x_user_role: Optional[str] = Header(None)):
    if x_user_role != "PRINCIPAL":
        raise HTTPException(status_code=403, detail="Phải là PRINCIPAL mới truy cập")

@router.get("/notifications", response_model=List[NotificationOut], dependencies=[Depends(require_principal)])
def get_notifications(db: Session = Depends(get_db)):
    workflows = db.query(ApprovalWorkflow).filter(
        ApprovalWorkflow.reviewer_role == "PRINCIPAL",
        ApprovalWorkflow.status == "PENDING"
    ).all()

    results = []
    for wf in workflows:
        s = db.query(Syllabus).filter(Syllabus.syllabus_id == wf.syllabus_id).first()
        results.append({
            "syllabus_id": s.syllabus_id,
            "course_code": s.course_code,
            "course_name": s.course_name,
            "submitted_date": s.created_at.isoformat() if getattr(s, "created_at", None) else None,
            "status": wf.status,
            "workflow_id": wf.workflow_id
        })
    return results

# ===== Pending list for Principal =====
@router.get("/pending", response_model=List[PendingSyllabusOut], dependencies=[Depends(require_principal)])
def list_pending(
    search: Optional[str] = None,
    faculty_id: Optional[int] = None,
    year: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = (
        db.query(Syllabus, User, Course, Faculty, ApprovalWorkflow)
        .join(User, User.user_id == Syllabus.created_by)
        .outerjoin(Course, Course.course_code == Syllabus.course_code)
        .outerjoin(Faculty, Faculty.faculty_id == Course.faculty_id)
        .join(ApprovalWorkflow, ApprovalWorkflow.syllabus_id == Syllabus.syllabus_id)
        .filter(
            ApprovalWorkflow.reviewer_role == "PRINCIPAL",
            ApprovalWorkflow.status == "PENDING"
        )
    )

    if search:
        q = q.filter(Syllabus.course_name.ilike(f"%{search}%"))
    if faculty_id:
        q = q.filter(Faculty.faculty_id == faculty_id)
    if year:
        q = q.filter(Syllabus.__table__.c.get("academic_year") == year)

    rows = q.all()

    results = []
    for s, u, c, f, wf in rows:
        aa_note = (
            db.query(ApprovalWorkflow.comment)
            .filter(
                ApprovalWorkflow.syllabus_id == s.syllabus_id,
                ApprovalWorkflow.reviewer_role == "AA"
            )
            .scalar()
        )

        results.append({
            "syllabus_id": s.syllabus_id,
            "course_code": s.course_code,
            "course_name": s.course_name,
            "faculty_name": f.faculty_name if f else None,
            "academic_year": getattr(s, "academic_year", None),
            "status": "pending",
            "creator_name": u.full_name if u else None,
            "aa_note": aa_note
        })
    return results

# ===== Pending detail for Principal =====
@router.get("/pending/{syllabus_id}", response_model=SyllabusDetailOut, dependencies=[Depends(require_principal)])
def pending_detail(syllabus_id: int, db: Session = Depends(get_db)):
    s = db.query(Syllabus).filter(Syllabus.syllabus_id == syllabus_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")

    creator = db.query(User).filter(User.user_id == s.created_by).first()
    aa_note = (
        db.query(ApprovalWorkflow.comment)
        .filter(
            ApprovalWorkflow.syllabus_id == syllabus_id,
            ApprovalWorkflow.reviewer_role == "AA"
        )
        .scalar()
    )

    timeline = (
        db.query(ApprovalWorkflow)
        .filter(ApprovalWorkflow.syllabus_id == syllabus_id)
        .order_by(ApprovalWorkflow.step_order)
        .all()
    )

    return {
        "syllabus_id": s.syllabus_id,
        "course_code": s.course_code,
        "course_name": s.course_name,
        "credits": s.credits,
        "description": s.description,
        "academic_year": getattr(s, "academic_year", None),
        "creator_name": creator.full_name if creator else None,
        "aa_note": aa_note,
        "approval_timeline": [
            {
                "role": t.reviewer_role,
                "status": t.status,
                "comment": t.comment,
                "reviewed_at": t.reviewed_at.isoformat() if t.reviewed_at else None
            }
            for t in timeline
        ]
    }

# ===== Approved list for Principal =====
@router.get("/approved", response_model=List[ApprovedSyllabusOut], dependencies=[Depends(require_principal)])
def list_approved(
    search: Optional[str] = None,
    faculty_id: Optional[int] = None,
    year: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = (
        db.query(Syllabus, User, Course, Faculty, ApprovalWorkflow)
        .join(User, User.user_id == Syllabus.created_by)
        .outerjoin(Course, Course.course_code == Syllabus.course_code)
        .outerjoin(Faculty, Faculty.faculty_id == Course.faculty_id)
        .join(ApprovalWorkflow, ApprovalWorkflow.syllabus_id == Syllabus.syllabus_id)
        .filter(
            ApprovalWorkflow.reviewer_role == "PRINCIPAL",
            ApprovalWorkflow.status == "APPROVED"
        )
    )

    if search:
        q = q.filter(
            (Syllabus.course_name.ilike(f"%{search}%")) |
            (Syllabus.course_code.ilike(f"%{search}%"))
        )
    if faculty_id:
        q = q.filter(Faculty.faculty_id == faculty_id)
    if year:
        q = q.filter(Syllabus.__table__.c.get("academic_year") == year)

    rows = q.all()

    return [
        {
            "syllabus_id": s.syllabus_id,
            "course_code": s.course_code,
            "course_name": s.course_name,
            "faculty_name": f.faculty_name if f else None,
            "creator_name": u.full_name if u else None,
            "approved_date": wf.reviewed_at.isoformat() if wf.reviewed_at else None,
            "status": "approved"
        }
        for s, u, c, f, wf in rows
    ]

# ===== Approved detail for Principal =====
@router.get("/approved/{syllabus_id}", response_model=SyllabusDetailOut, dependencies=[Depends(require_principal)])
def approved_detail(syllabus_id: int, db: Session = Depends(get_db)):
    return pending_detail(syllabus_id, db)

@router.post("/final-approvals/{syllabus_id}/approve", dependencies=[Depends(require_principal)])
def approve_final(syllabus_id: int, comment: Optional[str] = None, x_user_id: Optional[int] = Header(None), db: Session = Depends(get_db)):
    wf = db.query(ApprovalWorkflow).filter(
        ApprovalWorkflow.syllabus_id == syllabus_id,
        ApprovalWorkflow.reviewer_role == "PRINCIPAL",
        ApprovalWorkflow.status == "PENDING"
    ).first()
    if not wf:
        raise HTTPException(status_code=404, detail="No pending approval for this syllabus")

    wf.status = "APPROVED"
    wf.reviewed_at = datetime.utcnow()

    # Update syllabus final state
    s = db.query(Syllabus).filter(Syllabus.syllabus_id == syllabus_id).first()
    s.status = "APPROVED"

    # Add review comment if provided
    if comment and x_user_id:
        rc = ReviewComment(
            syllabus_id=syllabus_id,
            version_id=0,  # nếu có version, gán đúng version_id
            reviewer_id=x_user_id,
            reviewer_role="PRINCIPAL",
            content=comment
        )
        db.add(rc)

    db.commit()
    return {"message": "Approved", "syllabus_id": syllabus_id}

@router.post("/final-approvals/{syllabus_id}/reject", dependencies=[Depends(require_principal)])
def reject_final(syllabus_id: int, reason: str, x_user_id: Optional[int] = Header(None), db: Session = Depends(get_db)):
    wf = db.query(ApprovalWorkflow).filter(
        ApprovalWorkflow.syllabus_id == syllabus_id,
        ApprovalWorkflow.reviewer_role == "PRINCIPAL",
        ApprovalWorkflow.status == "PENDING"
    ).first()
    if not wf:
        raise HTTPException(status_code=404, detail="No pending approval for this syllabus")

    wf.status = "REJECTED"
    wf.reviewed_at = datetime.utcnow()

    s = db.query(Syllabus).filter(Syllabus.syllabus_id == syllabus_id).first()
    s.status = "NEEDS_REVISION"

    # Save comment
    if x_user_id:
        rc = ReviewComment(
            syllabus_id=syllabus_id,
            version_id=0,
            reviewer_id=x_user_id,
            reviewer_role="PRINCIPAL",
            content=reason
        )
        db.add(rc)

    db.commit()
    return {"message": "Rejected", "syllabus_id": syllabus_id}
