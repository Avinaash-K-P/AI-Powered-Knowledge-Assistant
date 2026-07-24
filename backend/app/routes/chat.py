from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import get_current_user
from app.schemas.chat import ChatAskRequest
from app.services.chat_service import (
    ask_question,
    get_chat_history
)

router = APIRouter(prefix="/chat", tags=["AI Question Answering"])

@router.post("/ask")
def ask_question_route(
    payload: ChatAskRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return ask_question(
        db=db,
        user_id=user["id"],
        question=payload.question,
    )

@router.get("/history")
def view_chat_history(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db:Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return get_chat_history(
        db=db,
        user_id=user["id"],
        limit=limit,
        offset=offset 
    )
         