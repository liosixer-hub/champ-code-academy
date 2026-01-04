from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, lessons

app = FastAPI(title="Champ Code Academy API", version="1.0.0")

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

# 注册路由
app.include_router(auth.router)
app.include_router(lessons.router)

@app.get("/")
def read_root():
    return {"message": "Champ Code API is running", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)