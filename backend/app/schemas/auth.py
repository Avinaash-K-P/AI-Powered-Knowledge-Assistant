from pydantic import BaseModel, EmailStr

class RegiserUser(BaseModel):
    username:str
    email:EmailStr
    password:str 

class LoginUser(BaseModel):
    email: EmailStr
    password:str    
