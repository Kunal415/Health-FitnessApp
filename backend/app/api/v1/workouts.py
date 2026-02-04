
from fastapi import APIRouter
router = APIRouter()

@router.post("/")
async def create_workout():
    return {"message": "Workout created"}
