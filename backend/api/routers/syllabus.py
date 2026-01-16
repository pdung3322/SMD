from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.infrastructure.databases.database import SessionLocal
from backend.api.schemas.syllabus import (
    SyllabusPendingItem,
    SyllabusDetail,
    ReviewSubmitRequest,
    ReviewSubmitResponse,
    CLOItem,
    VersionDiffResponse,
)
from backend.services.approval_service import ApprovalService
from backend.infrastructure.models.clo import CLO
from backend.infrastructure.models.syllabus_version import SyllabusVersion
from backend.infrastructure.models.syllabus import Syllabus
from datetime import datetime

router = APIRouter(
    prefix="/syllabus",
    tags=["Syllabus"]
)

# ===== DB DEPENDENCY =====
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =====================================================
# HOD ENDPOINTS
# =====================================================

@router.get("/pending", response_model=List[SyllabusPendingItem])
def get_pending_for_hod(
    hod_id: int,
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách đề cương đang chờ HOD duyệt
    
    Query param: hod_id (ID của HOD đang đăng nhập)
    Return: List[SyllabusPendingItem]
    """
    try:
        service = ApprovalService(db)
        pending_list = service.list_pending_for_hod(hod_id)
        return pending_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{syllabus_id}/detail", response_model=SyllabusDetail)
def get_syllabus_detail_for_review(
    syllabus_id: int,
    db: Session = Depends(get_db)
):
    """
    Lấy chi tiết đề cương để HOD duyệt
    Bao gồm: nội dung, lịch sử duyệt, comments
    
    Path param: syllabus_id
    Return: SyllabusDetail
    """
    try:
        service = ApprovalService(db)
        detail = service.get_syllabus_detail(syllabus_id)
        return detail
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{syllabus_id}/review", response_model=ReviewSubmitResponse)
def submit_hod_review(
    syllabus_id: int,
    request: ReviewSubmitRequest,
    hod_id: int,
    db: Session = Depends(get_db)
):
    """
    HOD gửi quyết định duyệt/từ chối/yêu cầu chỉnh sửa
    
    Path param: syllabus_id
    Query param: hod_id (ID của HOD đang đăng nhập)
    Body: ReviewSubmitRequest {decision, feedback}
    Return: ReviewSubmitResponse
    
    Decision values:
    - APPROVED: Phê duyệt (chuyển sang AA)
    - REJECTED: Từ chối
    - REVISION: Yêu cầu chỉnh sửa
    """
    try:
        service = ApprovalService(db)
        response = service.submit_hod_review(
            syllabus_id=syllabus_id,
            hod_id=hod_id,
            decision=request.decision,
            feedback=request.feedback
        )
        return response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{syllabus_id}/clos", response_model=List[CLOItem])
def get_clos_for_syllabus(
    syllabus_id: int,
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách CLO của phiên bản syllabus mới nhất.

    - Path param: syllabus_id
    - Return: List[CLOItem]
    """
    try:
        latest_version = (
            db.query(SyllabusVersion)
            .filter(SyllabusVersion.syllabus_id == syllabus_id)
            .order_by(SyllabusVersion.version_number.desc())
            .first()
        )

        if not latest_version:
            return []

        clos = (
            db.query(CLO)
            .filter(CLO.syllabus_version_id == latest_version.version_id)
            .all()
        )

        return clos
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{syllabus_id}/version-diff", response_model=VersionDiffResponse)
def get_version_diff_for_hod(
    syllabus_id: int,
    db: Session = Depends(get_db)
):
    """
    Lấy diff giữa 2 phiên bản mới nhất của syllabus (dành cho HOD review).
    Nếu chỉ có 1 phiên bản, trả meta và danh sách diff rỗng.
    """
    try:
        syllabus = db.query(Syllabus).filter(Syllabus.syllabus_id == syllabus_id).first()
        if not syllabus:
            raise HTTPException(status_code=404, detail="Syllabus not found")

        versions = (
            db.query(SyllabusVersion)
            .filter(SyllabusVersion.syllabus_id == syllabus_id)
            .order_by(SyllabusVersion.version_number.desc())
            .limit(2)
            .all()
        )

        if not versions:
            raise HTTPException(status_code=404, detail="No version found")

        to_version = versions[0]
        from_version = versions[1] if len(versions) > 1 else None

        # TODO: thay bằng diff thực tế; hiện trả danh sách rỗng để FE hiển thị "không có thay đổi"
        diff_items: list = []

        return VersionDiffResponse(
            syllabus_id=syllabus_id,
            course_name=syllabus.course_name,
            from_version=f"v{from_version.version_number}" if from_version else "N/A",
            to_version=f"v{to_version.version_number}",
            generated_at=datetime.utcnow(),
            items=diff_items,
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =====================================================
# EXISTING ENDPOINTS (giữ lại cũ)
# =====================================================

@router.get("", response_model=List[dict])
def get_syllabus_list(db: Session = Depends(get_db)):
    """Danh sách tất cả syllabus"""
    # Keep existing logic
    pass


@router.get("/{syllabus_id}", response_model=dict)
def get_syllabus_info(syllabus_id: int, db: Session = Depends(get_db)):
    """Chi tiết syllabus (cơ bản, không kèm approval info)"""
    # Keep existing logic
    pass