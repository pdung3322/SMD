from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from backend.infrastructure.databases.database import SessionLocal
from backend.infrastructure.models.academic_year import AcademicYear
from backend.infrastructure.models.semester import Semester

router = APIRouter(
    prefix="/api/academic",
    tags=["Academic"]
)

# ===== DB DEPENDENCY =====
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =====================================================
# ACADEMIC YEAR
# =====================================================

@router.post("/academic-years")
def create_academic_year(
    name: str,
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db)
):
    if start_date >= end_date:
        raise HTTPException(400, "Invalid date range")

    year = AcademicYear(
        name=name,
        start_date=start_date,
        end_date=end_date
    )
    db.add(year)
    db.commit()
    return {"message": "Academic year created"}


@router.get("/academic-years")
def get_academic_years(db: Session = Depends(get_db)):
    return db.query(AcademicYear).order_by(
        AcademicYear.start_date.desc()
    ).all()


@router.put("/academic-years/{year_id}")
def update_academic_year(
    year_id: int,
    name: str,
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db)
):
    year = db.get(AcademicYear, year_id)
    if not year:
        raise HTTPException(404, "Academic year not found")

    year.name = name
    year.start_date = start_date
    year.end_date = end_date
    db.commit()
    return {"message": "Academic year updated"}


@router.delete("/academic-years/{year_id}")
def delete_academic_year(year_id: int, db: Session = Depends(get_db)):
    year = db.get(AcademicYear, year_id)
    if not year:
        raise HTTPException(404, "Academic year not found")

    db.delete(year)
    db.commit()
    return {"message": "Academic year deleted"}


@router.patch("/academic-years/{year_id}/activate")
def activate_academic_year(year_id: int, db: Session = Depends(get_db)):
    db.query(AcademicYear).update({"is_active": False})

    year = db.get(AcademicYear, year_id)
    if not year:
        raise HTTPException(404, "Academic year not found")

    year.is_active = True
    db.commit()
    return {"message": "Academic year activated"}


@router.patch("/academic-years/{year_id}/close")
def close_academic_year(year_id: int, db: Session = Depends(get_db)):
    year = db.get(AcademicYear, year_id)
    if not year:
        raise HTTPException(404, "Academic year not found")

    year.is_closed = True
    year.is_active = False
    db.commit()
    return {"message": "Academic year closed"}

# =====================================================
# SEMESTER
# =====================================================

@router.post("/semesters")
def create_semester(
    academic_year_id: int,
    code: str,
    name: str,
    start_date: date,
    end_date: date,
    is_optional: bool = False,
    db: Session = Depends(get_db)
):
    semester = Semester(
        academic_year_id=academic_year_id,
        code=code,
        name=name,
        start_date=start_date,
        end_date=end_date,
        is_optional=is_optional
    )
    db.add(semester)
    db.commit()
    return {"message": "Semester created"}


@router.get("/semesters")
def get_semesters(
    academic_year_id: int,
    db: Session = Depends(get_db)
):
    return db.query(Semester).filter(
        Semester.academic_year_id == academic_year_id
    ).order_by(Semester.start_date).all()


@router.put("/semesters/{semester_id}")
def update_semester(
    semester_id: int,
    code: str,
    name: str,
    start_date: date,
    end_date: date,
    is_optional: bool,
    db: Session = Depends(get_db)
):
    semester = db.get(Semester, semester_id)
    if not semester:
        raise HTTPException(404, "Semester not found")

    semester.code = code
    semester.name = name
    semester.start_date = start_date
    semester.end_date = end_date
    semester.is_optional = is_optional
    db.commit()
    return {"message": "Semester updated"}


@router.delete("/semesters/{semester_id}")
def delete_semester(semester_id: int, db: Session = Depends(get_db)):
    semester = db.get(Semester, semester_id)
    if not semester:
        raise HTTPException(404, "Semester not found")

    db.delete(semester)
    db.commit()
    return {"message": "Semester deleted"}


@router.patch("/semesters/{semester_id}/set-current")
def set_current_semester(
    semester_id: int,
    db: Session = Depends(get_db)
):
    semester = db.get(Semester, semester_id)
    if not semester:
        raise HTTPException(404, "Semester not found")

    # reset current trong cùng năm học
    db.query(Semester).filter(
        Semester.academic_year_id == semester.academic_year_id
    ).update({"is_current": False})

    semester.is_current = True
    semester.is_active = True

    db.commit()
    return {"message": "Current semester set"}



@router.get("/current-semester")
def get_current_semester(db: Session = Depends(get_db)):
    semester = (
        db.query(Semester, AcademicYear)
        .join(AcademicYear, Semester.academic_year_id == AcademicYear.id)
        .filter(Semester.is_current == True)
        .first()
    )

    if not semester:
        raise HTTPException(404, "No current semester")

    s, y = semester
    return {
        "id": s.id,
        "name": s.name,
        "code": s.code,
        "academic_year": y.name
    }


