from pydantic import BaseModel

class SyllabusCreateResponse(BaseModel):
    syllabus_id: int
    course_code: str
    course_name: str
    credits: int
    status: str
    message: str

    class Config:
        from_attributes = True
