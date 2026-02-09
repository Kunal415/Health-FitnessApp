from app.schemas import schemas

def get_advice(user: schemas.User) -> dict:
    advice = {
        "exercise": "Please update your profile to get personalized advice.",
        "nutrition": "Please update your profile to get personalized advice."
    }
    
    if not user.goal:
        return advice

    goal = user.goal.lower()
    conditions = user.medical_conditions.lower() if user.medical_conditions else ""
    
    # Nutrition Advice logic based on goal
    if "lose" in goal or "weight loss" in goal:
        advice["nutrition"] = "To lose weight, aim for a calorie deficit. Focus on high-protein, fiber-rich foods like vegetables, lean meats, and whole grains. Avoid sugary drinks and processed snacks. Try intermittent fasting if suitable."
    elif "gain" in goal or "muscle" in goal:
        advice["nutrition"] = "To gain muscle, ensure you're in a slight calorie surplus with plenty of protein (1.6-2.2g per kg of body weight). Eat complex carbs for energy and healthy fats."
    else:
        advice["nutrition"] = "Maintain a balanced diet rich in whole foods, vegetables, lean proteins, and healthy fats. Stay hydrated."

    # Exercise Advice logic
    if "lose" in goal:
        advice["exercise"] = "Combine cardio (running, cycling, swimming) with strength training to maintain muscle while losing fat. Aim for 150 mins of moderate activity per week."
    elif "gain" in goal:
        advice["exercise"] = "Focus on hypertrophy-based strength training. Train each muscle group 2 times a week with progressive overload. Compound movements like squats, deadlifts, and bench press are key."
    else:
        advice["exercise"] = "Mix moderate cardio with full-body strength training 2-3 times a week to stay fit and active."

    # Medical conditions consideration
    if "diabetes" in conditions:
        advice["nutrition"] += " Monitor carbohydrate intake and choose low-GI foods."
    if "heart" in conditions or "pressure" in conditions:
        advice["exercise"] += " Consult your doctor before intense exercise. Low-impact cardio is typically recommended."
    if "joint" in conditions or "knee" in conditions:
        advice["exercise"] += " Avoid high-impact activities like jumping. Swimming or cycling are great alternatives."

    return advice
