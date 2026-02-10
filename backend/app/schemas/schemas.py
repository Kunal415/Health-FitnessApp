from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Workout Schemas
class WorkoutBase(BaseModel):
    title: str
    description: Optional[str] = None
    duration: int

class WorkoutCreate(WorkoutBase):
    pass

class Workout(WorkoutBase):
    id: int
    date: datetime
    owner_id: int
    calories: float
    analysis: Optional[str] = None

    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    medical_conditions: Optional[str] = None
    goal: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    medical_conditions: Optional[str] = None
    goal: Optional[str] = None
    workouts: List[Workout] = []

    class Config:
        orm_mode = True

class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class Msg(BaseModel):
    message: str
