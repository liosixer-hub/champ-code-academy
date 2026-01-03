@echo off
chcp 65001 >nul
cls
echo.
echo ===============================================
echo Champ Code Academy - 前端启动脚本
echo ===============================================
echo.
echo 清理端口 5000-5004...

REM 停止占用5000端口的进程
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000"') do (
    echo 找到进程 PID: %%a，正在停止...
    taskkill /PID %%a /F 2>nul
)

REM 停止占用5001端口的进程
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5001"') do (
    echo 找到进程 PID: %%a，正在停止...
    taskkill /PID %%a /F 2>nul
)

REM 停止占用5002端口的进程
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5002"') do (
    echo 找到进程 PID: %%a，正在停止...
    taskkill /PID %%a /F 2>nul
)

REM 停止占用5003端口的进程
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5003"') do (
    echo 找到进程 PID: %%a，正在停止...
    taskkill /PID %%a /F 2>nul
)

REM 停止占用5004端口的进程
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5004"') do (
    echo 找到进程 PID: %%a，正在停止...
    taskkill /PID %%a /F 2>nul
)

echo.
echo 启动前端模块...
echo.
echo Host: http://localhost:5000
echo Shared: http://localhost:5001
echo Login: http://localhost:5002
echo Dashboard: http://localhost:5003
echo Home: http://localhost:5004
echo.
echo ===============================================
echo.

REM 启动前端应用，选择all
cd /d "%~dp0"
echo all | pnpm dev

pause
