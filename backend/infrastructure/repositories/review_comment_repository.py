from sqlalchemy.orm import Session
from backend.infrastructure.models.review_comment import ReviewComment
from typing import List
from datetime import datetime


class ReviewCommentRepository:
    """
    Repository để quản lý comment/nhận xét
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def add_comment(
        self,
        syllabus_id: int,
        version_id: int,
        reviewer_id: int,
        reviewer_role: str,
        content: str
    ) -> ReviewComment:
        """
        Thêm comment mới khi HOD/AA phản hồi
        """
        comment = ReviewComment(
            syllabus_id=syllabus_id,
            version_id=version_id,
            reviewer_id=reviewer_id,
            reviewer_role=reviewer_role,
            content=content,
            created_at=datetime.utcnow()
        )
        self.db.add(comment)
        self.db.commit()
        self.db.refresh(comment)
        return comment
    
    def get_comments_by_syllabus(
        self, 
        syllabus_id: int
    ) -> List[ReviewComment]:
        """
        Lấy tất cả comments của 1 syllabus
        """
        comments = (
            self.db.query(ReviewComment)
            .filter(ReviewComment.syllabus_id == syllabus_id)
            .order_by(ReviewComment.created_at.desc())
            .all()
        )
        return comments