from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.chat_history import ChatHistory
from app.ai.rag import answer_question_from_documents


def ask_question(
    db: Session,
    user_id: int,
    question: str,
):
    cleaned_question = question.strip()

    if not cleaned_question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty",
        )

    result = answer_question_from_documents(
        user_id=user_id,
        question=cleaned_question,
    )

    chat_history = ChatHistory(
        user_id = user_id,
        question = question,
        answer = result["answer"], 
        sources = result["sources"]        
    )

    db.add(chat_history)
    db.commit()
    db.refresh(chat_history)

    return result

def get_chat_history(
    db:Session,
    user_id:int,
    limit: int = 10,
    offset: int = 0,    
):
    
    conversations = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == user_id)
        .order_by(ChatHistory.created_at.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    total = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == user_id)
        .count()
    )

    return {
        "items": conversations,
        "total": total,
        "limit": limit,
        "offset": offset,
    }

