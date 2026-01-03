from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import json
import os

app = FastAPI()

# 允许微前端的所有端口跨域访问
origins = [
    "http://localhost:5000", # Host
    "http://localhost:5001", # Shared
    "http://localhost:5002", # Login
    "http://localhost:5003", # Dashboard
    "http://localhost:5004", # Home
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: str

class Lesson(BaseModel):
    id: str
    date: str
    type: str  # "Historic", "Upcoming", "Available", "Today"
    subject: str
    students: List[str]
    tutor: Optional[str]
    status: str  # "Completed", "Confirmed", "Available"

@app.get("/")
def read_root():
    return {"message": "Champ Code API is running"}

@app.post("/login", response_model=User)
def login(request: LoginRequest):
    # Mock authentication - in real app, check against database
    if request.email == "user@example.com" and request.password == "password":
        return User(id=1, name="John Doe", email=request.email)
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

# Load Lessons Data from JSON file
def load_lessons_data() -> List[dict]:
    """从JSON文件加载课程数据"""
    data_file = os.path.join(os.path.dirname(__file__), "lessons_data.json")
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Warning: {data_file} not found, using empty list")
        return []
    except json.JSONDecodeError:
        print(f"Warning: Invalid JSON in {data_file}, using empty list")
        return []

mock_lessons: List[dict] = load_lessons_data()

@app.get("/lessons", response_model=List[Lesson])
def get_lessons():
    """获取所有课程列表"""
    return mock_lessons

@app.get("/lessons/{lesson_id}", response_model=Lesson)
def get_lesson(lesson_id: str):
    """获取特定课程"""
    for lesson in mock_lessons:
        if lesson["id"] == lesson_id:
            return lesson
    raise HTTPException(status_code=404, detail="Lesson not found")

@app.post("/lessons/{lesson_id}/take")
def take_lesson(lesson_id: str):
    """导师接受一个Available课程"""
    for lesson in mock_lessons:
        if lesson["id"] == lesson_id:
            if lesson["type"] == "Available":
                lesson["type"] = "Upcoming"
                lesson["tutor"] = "Sarah Tan"  # Mock tutor name
                lesson["status"] = "Confirmed"
                return {"success": True, "message": "Lesson taken successfully", "lesson": lesson}
            else:
                raise HTTPException(status_code=400, detail="Lesson is not available")
    raise HTTPException(status_code=404, detail="Lesson not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)