from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.infrastructure.databases.database import SessionLocal
from backend.infrastructure.models.course import Course

router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("")
def get_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()
