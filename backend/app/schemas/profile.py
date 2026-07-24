from pydantic import BaseModel, EmailStr

class ProfileUpdate(BaseModel):
    username: str
    email: EmailStr    