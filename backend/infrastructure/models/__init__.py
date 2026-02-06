# File: backend/infrastructure/models/__init__.py

from .user import User
from .syllabus import Syllabus
# ... các model khác ...

# --- THÊM DÒNG NÀY ---
from .approval_history import ApprovalHistory 
# (Lưu ý: Thay 'approval_history' bằng tên file thực tế chứa class ApprovalHistory của bạn)