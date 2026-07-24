from fastapi import APIRouter, Depends
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.schemas.auth import (
    RegiserUser,
    LoginUser,
)

from app.services.auth_service import (
    create_user,
    check_user,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
def register_user(
        payload: RegiserUser, 
        db:Session = Depends(get_db)
    ):

    return create_user(db=db,payload=payload)
    
@router.post("/login")
def login_user(
        payload: LoginUser, 
        db:Session = Depends(get_db)
    ):

    return check_user(db=db,payload=payload)
    
