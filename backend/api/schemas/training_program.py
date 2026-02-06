from pydantic import BaseModel
from typing import List, Optional


class TrainingProgramItem(BaseModel):
    academic_year: str
    file_path: str


class TrainingProgramSpecialization(BaseModel):
    specialization_id: int
    specialization_name: str
    programs: List[TrainingProgramItem]


class TrainingProgramMajor(BaseModel):
    major_name: str
    specializations: List[TrainingProgramSpecialization]
