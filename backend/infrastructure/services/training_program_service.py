from collections import defaultdict
from backend.infrastructure.repositories.training_program_repository import (
    TrainingProgramRepository
)


class TrainingProgramService:

    @staticmethod
    def get_training_programs(db):
        rows = TrainingProgramRepository.get_all(db)

        majors = defaultdict(lambda: defaultdict(list))

        for row in rows:
            majors[row.major_name][
                (row.specialization_id, row.specialization_name)
            ].append({
                "academic_year": row.academic_year,
                "file_path": row.file_path
            })

        result = []

        for major_name, specs in majors.items():
            specializations = []
            for (spec_id, spec_name), programs in specs.items():
                specializations.append({
                    "specialization_id": spec_id,
                    "specialization_name": spec_name,
                    "programs": programs
                })

            result.append({
                "major_name": major_name,
                "specializations": specializations
            })

        return result
