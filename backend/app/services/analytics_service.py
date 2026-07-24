from sqlalchemy.orm import Session
from app.models.user import User
from app.models.document import Document
from app.models.chat_history import ChatHistory
from sqlalchemy import func

def get_total_documents(db:Session):

    total_count = db.query(Document).count()

    return total_count

def get_total_questions(db:Session):

    total_questions = db.query(ChatHistory).count()

    return total_questions

def get_recent_converstation(db:Session):

    recent_con = db.query(ChatHistory).all()

    return recent_con

def get_active_users(db:Session, limit: int = 5):

    active_users = (
        db.query(
            User.id.label("user_id"),
            User.username.label("username"),
            User.email.label("email"),
            func.count(ChatHistory.id).label("total_questions"),
        )
        .join(ChatHistory, ChatHistory.user_id == User.id)
        .group_by(User.id, User.username, User.email)
        .order_by(func.count(ChatHistory.id).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "total_questions": user.total_questions,
        }
        for user in active_users
    ]


def get_analytics(db:Session):

    total_docs = get_total_documents(db=db)

    total_qns = get_total_questions(db=db)

    recent_con = get_recent_converstation(db=db)

    active_users = get_active_users(db=db, limit=5)

    return {

        "message" : "Analytics for Dashboard",

        "total_documents": total_docs,

        "total_questions": total_qns,

        "recent_conversation": recent_con,

        "active_users" : active_users
    } 