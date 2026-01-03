from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel

app = FastAPI()

# 允许微前端的所有端口跨域访问
origins = [
    "http://localhost:5000", # Host
    "http://localhost:5001", # Login
    "http://localhost:5002", # Dashboard
    "http://localhost:5003", # Shared
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
    name: str
    email: str

@app.get("/")
def read_root():
    return {"message": "Champ Code API is running"}

@app.post("/login", response_model=User)
def login(request: LoginRequest):
    # Mock authentication - in real app, check against database
    if request.email == "user@example.com" and request.password == "password":
        return User(name="John Doe", email=request.email)
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

# TODO: 在后续步骤实现具体 Login 和 Lesson 数据接口

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)