from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum

class RoleEnum(str, Enum):
    HR = "HR"
    USER = "USER"

class UserBase(BaseModel):
    email: EmailStr
    role: RoleEnum = RoleEnum.USER

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDB(UserBase):
    id: Optional[str] = None
    hashed_password: str

class UserResponse(UserBase):
    pass

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
