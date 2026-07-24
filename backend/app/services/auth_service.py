from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import ( 
    RegiserUser, 
    LoginUser
)
from fastapi import HTTPException
from app.core.security import (
    hash_password, 
    verify_password, 
    create_access_token
)

def create_user(db:Session, payload:RegiserUser):

    existing_username = db.query(User).filter(User.username == payload.username).first()

    existing_email = db.query(User).filter(User.email == payload.email).first()

    if existing_username or existing_email:

        raise HTTPException(status_code=404, detail="User Already Existy")

    if len(payload.password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,
            detail="Password must be 72 bytes or fewer",
        )

    new_user = User(
        username = payload.username,
        email = payload.email,
        password = hash_password(payload.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message":"New user registered!"
    }

def check_user(db:Session, payload:LoginUser):

    valid_user = db.query(User).filter(User.email == payload.email).first()

    valid_password = verify_password(payload.password, valid_user.password) #type:ignore

    if not valid_user:

        raise HTTPException(status_code=401, detail="Invalid Email")

    if not valid_password: 

        raise HTTPException(status_code=401, detail="Invalid password")

    user_details = {
        "id": valid_user.id,
        "username": valid_user.username,
        "email": valid_user.email
    }
    
    token = create_access_token(user_details)

    return {
        "message":"Login successful!",
        "access_token": token,
        "token_type": "Bearer"
    }