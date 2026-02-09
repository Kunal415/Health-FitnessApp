from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas import schemas
from app.models import models

router = APIRouter()

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(deps.get_current_user)):
    return current_user

from app.core import advisor
import traceback

@router.put("/me", response_model=schemas.User)
def update_user_me(
    user_in: schemas.UserUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    """
    Update own user.
    """
    user_data = user_in.dict(exclude_unset=True)
    for field, value in user_data.items():
        setattr(current_user, field, value)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/me/advice")
def get_user_advice(
    current_user: models.User = Depends(deps.get_current_user)
):
    """
    Get personalized advice based on user profile.
    """
    try:
        # Manually construct schema to avoid validation errors on unrelated fields (like workouts)
        # and to avoid lazy loading issues.
        user_schema = schemas.User(
            id=current_user.id,
            email=current_user.email,
            is_active=current_user.is_active,
            age=current_user.age,
            gender=current_user.gender,
            height=current_user.height,
            weight=current_user.weight,
            medical_conditions=current_user.medical_conditions,
            goal=current_user.goal,
            workouts=[]
        )
        return advisor.get_advice(user_schema)
    except Exception as e:
        print(f"Error generating advice: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(deps.get_db), current_user: models.User = Depends(deps.get_current_user)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users
