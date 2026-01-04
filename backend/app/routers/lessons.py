from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
import json
import os

router = APIRouter(prefix="/api/lessons", tags=["lessons"])

class Lesson(BaseModel):
    id: str
    date: str
    type: str  # "Historic", "Upcoming", "Available", "Today"
    subject: str
    students: List[str]
    tutor: Optional[str]
    status: str  # "Completed", "Confirmed", "Available"

# Load Lessons Data from JSON file
def load_lessons_data() -> List[dict]:
    """从JSON文件加载课程数据"""
    # 获取app目录的路径
    app_dir = os.path.dirname(os.path.dirname(__file__))
    data_file = os.path.join(app_dir, "lessons_data.json")
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

@router.get("", response_model=List[Lesson])
def get_lessons():
    """获取所有课程列表"""
    return mock_lessons

@router.get("/{lesson_id}", response_model=Lesson)
def get_lesson(lesson_id: str):
    """获取特定课程"""
    for lesson in mock_lessons:
        if lesson["id"] == lesson_id:
            return lesson
    raise HTTPException(status_code=404, detail="Lesson not found")

@router.post("/{lesson_id}/take")
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

