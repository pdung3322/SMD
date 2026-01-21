from backend.infrastructure.databases.database import engine
from backend.infrastructure.databases.base import Base

# Import models để Base biết các bảng
from backend.infrastructure.models import (
    role,
    user,
    faculty,
    course,
    syllabus,
    syllabus_version,
    approval_workflow,
    review_comment,
    audit_log,
    plo,
    clo,
    clo_plo_mapping,
)

def main():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")

if __name__ == "__main__":
    main()