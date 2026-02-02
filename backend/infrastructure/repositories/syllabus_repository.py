from sqlalchemy.orm import Session
from backend.infrastructure.models.syllabus import Syllabus
from backend.infrastructure.models.syllabus_version import SyllabusVersion

class SyllabusRepository:
    def create_syllabus(self, db: Session, syllabus: Syllabus):
        db.add(syllabus)
        db.flush()
        return syllabus

    def create_version(self, db: Session, version: SyllabusVersion):
        db.add(version)
        db.flush()
        return version

    def get_all(self, db: Session):
        return db.query(Syllabus).order_by(Syllabus.created_at.desc()).all()

    def get_by_id(self, db: Session, syllabus_id: int):
        return db.query(Syllabus).filter(Syllabus.syllabus_id == syllabus_id).first()
