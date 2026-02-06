from sqlalchemy.orm import Session
from backend.infrastructure.models.training_program_file import TrainingProgramFile
from backend.infrastructure.models.specialization import Specialization


class TrainingProgramRepository:

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(
                Specialization.major_name,
                Specialization.specialization_id,
                Specialization.specialization_name,
                TrainingProgramFile.academic_year,
                TrainingProgramFile.file_path
            )
            .join(
                TrainingProgramFile,
                TrainingProgramFile.specialization_id == Specialization.specialization_id
            )
            .filter(TrainingProgramFile.status == "ACTIVE")
            .order_by(
                Specialization.major_name,
                Specialization.specialization_name,
                TrainingProgramFile.academic_year
            )
            .all()
        )
