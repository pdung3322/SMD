from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SyllabusResponse(BaseModel):
    syllabus_id: int
    course_code: str
    course_name: str
    credits: int

    # Mô tả đề cương (dùng cho trang Chi tiết giáo trình)
    description: Optional[str] = None

    created_at: datetime

    class Config:
        from_attributes = True
