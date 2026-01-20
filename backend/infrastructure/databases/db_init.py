from ...infrastructure.databases.database import engine
from ...infrastructure.databases.base import Base

# ⚠️ BẮT BUỘC import tất cả model
from ..models.role import Role
from ..models.user import User
from ..models.faculty import Faculty
from ..models.course import Course
from ..models.syllabus import Syllabus
from ..models.syllabus_version import SyllabusVersion
from ..models.approval_workflow import ApprovalWorkflow
from ..models.review_comment import ReviewComment
from ..models.audit_log import AuditLog
from ..models.plo import PLO
from ..models.clo import CLO
from ..models.clo_plo_mapping import CLOPLOMapping



def db_init():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")


if __name__ == "__main__":
    db_init()
