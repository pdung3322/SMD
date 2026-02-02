from pydantic import BaseModel
from datetime import datetime

class SyllabusListResponse(BaseModel):
    syllabus_id: int
    course_code: str
    course_name: str
    credits: int
    status: str
    created_by: int
    created_at: datetime

    class Config:
        from_attributes = True
