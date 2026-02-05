from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import difflib

from backend.infrastructure.databases.database import SessionLocal
from backend.api.schemas.syllabus import (
    SyllabusPendingItem,
    SyllabusListItem,
    SyllabusVersionItem,
    SyllabusDetail,
    ReviewSubmitRequest,
    ReviewSubmitResponse,
    CLOItem,
    VersionDiffResponse,
)
from backend.infrastructure.services.approval_service import ApprovalService
from backend.infrastructure.models.clo import CLO
from backend.infrastructure.models.syllabus_version import SyllabusVersion
from backend.infrastructure.models.syllabus import Syllabus
from backend.infrastructure.repositories.syllabus_repository import SyllabusRepository
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


@router.post("/{syllabus_id}/open-collab-review")
def open_collaborative_review(
    syllabus_id: int,
    hod_id: int,
    db: Session = Depends(get_db)
):
    """
    HOD mở phiên phản biện cho giáo trình
    """
    try:
        service = ApprovalService(db)
        return service.open_collaborative_review(syllabus_id, hod_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{syllabus_id}/detail", response_model=SyllabusDetail)
def get_syllabus_detail_for_review(
    syllabus_id: int,
    db: Session = Depends(get_db)
):
    """
    Lấy chi tiết đề cương để HOD duyệt
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

        if not from_version or not from_version.content or not to_version.content:
            diff_items: list = []
        else:
            from_lines = from_version.content.splitlines()
            to_lines = to_version.content.splitlines()
            diff_items = []
            matcher = difflib.SequenceMatcher(a=from_lines, b=to_lines)
            item_id = 1

            for tag, i1, i2, j1, j2 in matcher.get_opcodes():
                if tag == "equal":
                    continue

                before = "\n".join(from_lines[i1:i2]) if tag in ("replace", "delete") else None
                after = "\n".join(to_lines[j1:j2]) if tag in ("replace", "insert") else None

                if tag == "replace":
                    diff_type = "changed"
                elif tag == "delete":
                    diff_type = "removed"
                else:
                    diff_type = "added"

                diff_items.append(
                    {
                        "id": item_id,
                        "section": "content",
                        "type": diff_type,
                        "before": before or None,
                        "after": after or None,
                    }
                )
                item_id += 1

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


@router.get("", response_model=List[SyllabusListItem])
def get_syllabus_list(db: Session = Depends(get_db)):
    """
    Danh sách tất cả syllabus (dùng cho tra cứu/so sánh)
    """
    try:
        repo = SyllabusRepository(db)
        syllabi = repo.list_all()
        results: List[SyllabusListItem] = []

        for syllabus in syllabi:
            latest_version = (
                max(syllabus.versions, key=lambda v: v.version_number)
                if syllabus.versions else None
            )
            results.append(
                SyllabusListItem(
                    syllabus_id=syllabus.syllabus_id,
                    course_code=syllabus.course_code,
                    course_name=syllabus.course_name,
                    status=syllabus.status,
                    updated_at=syllabus.updated_at,
                    current_version=f"v{latest_version.version_number}" if latest_version else None,
                    lecturer_name=syllabus.creator.full_name if syllabus.creator else None,
                )
            )

        return results
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{syllabus_id}", response_model=SyllabusDetail)
def get_syllabus_info(syllabus_id: int, db: Session = Depends(get_db)):
    """Chi tiết syllabus (cơ bản, không kèm approval info)"""
    try:
        service = ApprovalService(db)
        return service.get_syllabus_detail(syllabus_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{syllabus_id}/versions", response_model=List[SyllabusVersionItem])
def get_syllabus_versions(syllabus_id: int, db: Session = Depends(get_db)):
    """Danh sách phiên bản của một syllabus"""
    try:
        repo = SyllabusRepository(db)
        versions = repo.get_versions(syllabus_id)
        if versions is None:
            raise HTTPException(status_code=404, detail="Syllabus not found")

        return [
            SyllabusVersionItem(
                version_id=v.version_id,
                version_number=v.version_number,
                content=v.content,
                created_at=v.created_at,
            )
            for v in versions
        ]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))