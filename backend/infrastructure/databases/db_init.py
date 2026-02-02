from backend.infrastructure.databases.database import engine
from backend.infrastructure.databases.base import Base

# ⚠️ BẮT BUỘC import tất cả model để SQLAlchemy nhận diện
from backend.infrastructure.models.role import Role
from backend.infrastructure.models.user import User
from backend.infrastructure.models.faculty import Faculty
from backend.infrastructure.models.course import Course
from backend.infrastructure.models.syllabus import Syllabus
from backend.infrastructure.models.syllabus_version import SyllabusVersion
from backend.infrastructure.models.approval_workflow import ApprovalWorkflow
from backend.infrastructure.models.review_comment import ReviewComment
from backend.infrastructure.models.audit_log import AuditLog
from backend.infrastructure.models.plo import PLO
from backend.infrastructure.models.clo import CLO
from backend.infrastructure.models.clo_plo_mapping import CLOPLOMapping
from backend.infrastructure.models.role_permission import RolePermission
from backend.infrastructure.models.user_permission import UserPermission
from backend.infrastructure.models.course_material import CourseMaterial
from backend.infrastructure.models.student_profile import StudentProfile
from backend.infrastructure.models.lecturer_profile import LecturerProfile
from backend.infrastructure.models.syllabus_file import SyllabusFile
from backend.infrastructure.models.academic_year import AcademicYear
from backend.infrastructure.models.semester import Semester


def db_init():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")


if __name__ == "__main__":
    db_init()
