from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: str

@router.post("/login", response_model=User)
def login(request: LoginRequest):
    """用户登录API"""
    # Mock authentication - in real app, check against database
    if request.email == "user@example.com" and request.password == "password":
        return User(id=1, name="John Doe", email=request.email)
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

