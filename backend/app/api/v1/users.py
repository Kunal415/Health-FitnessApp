from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas import schemas
from app.models import models

router = APIRouter()

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(deps.get_current_user)):
    return current_user

@router.get("/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users
