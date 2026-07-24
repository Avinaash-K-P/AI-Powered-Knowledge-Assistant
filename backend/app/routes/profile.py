from fastapi import APIRouter, Depends
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.schemas.profile import ProfileUpdate
from app.services.profile_service import get_profile, update_profile
from app.core.security import get_current_user

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("/view")
def view_profile(
        db:Session = Depends(get_db),
        user = Depends(get_current_user)
):
    return get_profile(db=db, user_id = user["id"])

@router.put("/update")
def edit_profile(
        payload: ProfileUpdate,
        db:Session = Depends(get_db),
        user = Depends(get_current_user)
):
    return update_profile(
        db=db,
        user_id=user["id"], 
        payload=payload
    )
