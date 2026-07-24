from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.profile import ProfileUpdate
from fastapi import HTTPException

def get_profile(
    db:Session,
    user_id:int
):
    profile = db.query(User).filter(User.id == user_id).first()

    if not profile:
        return {"message":"No user found"}
    
    else:
        return {
            "message":"User details fetched",
            "user_id": profile.id,
            "username": profile.username,
            "email": profile.email
        }
    
def update_profile(
    db: Session,
    user_id: int,
    payload: ProfileUpdate
):
        
    profile = db.query(User).filter(User.id == user_id).first()

    if not profile:
        return {"message":"No user found"}

    else: 
        profile.username = payload.username # type: ignore
        profile.email = payload.email  # type: ignore

        db.commit()
        db.refresh(profile)

        return {
            "message":"User details updated",
            "user_id": profile.id,
            "username": profile.username,
            "email": profile.email
        }    