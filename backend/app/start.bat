@echo off
chcp 65001 >nul
cls
echo.
echo ===============================================
echo Champ Code Academy - 后端启动脚本
echo ===============================================
echo.
echo 清理端口 8000...

REM 查找并停止占用8000端口的进程
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000"') do (
    echo 找到进程 PID: %%a，正在停止...
    taskkill /PID %%a /F 2>nul
)

REM 等待1秒
timeout /t 1 /nobreak >nul

echo.
echo 启动FastAPI服务器...
echo.
echo 访问地址: http://localhost:8000
echo API文档: http://localhost:8000/docs
echo.
echo ===============================================
echo.

REM 启动Python应用
cd /d "%~dp0"
python start.py
pause
