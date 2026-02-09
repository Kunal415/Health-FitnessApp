from pydantic import BaseModel
from typing import List, Optional

class MacroOutput(BaseModel):
    calories: float
    protein: float
    carbs: float
    fat: float

class FoodItemInput(BaseModel):
    name: str
    quantity: Optional[float] = 1 # Assuming 1 serving or 100g unit

class MealInput(BaseModel):
    name: str # e.g. Breakfast
    items: List[FoodItemInput]

class DailyPlanInput(BaseModel):
    meals: List[MealInput]

class FoodItemOutput(FoodItemInput, MacroOutput):
    pass

class MealOutput(MacroOutput):
    name: str
    items: List[FoodItemOutput]

class DailyAnalysis(MacroOutput):
    meals: List[MealOutput]
    suggestions: List[str]
