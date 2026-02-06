from pydantic import BaseModel
from typing import Optional

class CourseSimple(BaseModel):
    course_id: int
    course_name: str

    class Config:
        from_attributes = True


class CourseRelationResponse(BaseModel):
    prerequisite_id: int
    relation_type: str
    course: CourseSimple
    prerequisite_course: CourseSimple

    class Config:
        from_attributes = True



class CourseRelationCreate(BaseModel):
    course_id: int
    prerequisite_course_id: int
    relation_type: str
    note: Optional[str] = None


