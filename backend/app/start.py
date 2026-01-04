#!/usr/bin/env python
"""
后端启动脚本 - 启动前自动停止占用的端口
"""
import os
import sys
import subprocess
import time

def kill_port(port):
    """停止占用指定端口的进程"""
    try:
        if sys.platform == "win32":
            # Windows系统
            os.system(f"netstat -ano | findstr :{port}")
            result = subprocess.run(
                f'netstat -ano | findstr ":{port}"',
                shell=True,
                capture_output=True,
                text=True
            )
            if result.stdout:
                lines = result.stdout.strip().split('\n')
                for line in lines:
                    parts = line.split()
                    if len(parts) > 0:
                        pid = parts[-1]
                        try:
                            subprocess.run(f"taskkill /PID {pid} /F", shell=True)
                            print(f"✓ 已停止占用端口 {port} 的进程 (PID: {pid})")
                        except Exception as e:
                            print(f"✗ 停止进程失败: {e}")
        else:
            # Linux/Mac系统
            result = subprocess.run(
                f"lsof -i :{port}",
                shell=True,
                capture_output=True,
                text=True
            )
            if result.stdout:
                lines = result.stdout.strip().split('\n')[1:]  # 跳过header
                for line in lines:
                    parts = line.split()
                    if len(parts) > 1:
                        pid = parts[1]
                        try:
                            os.kill(int(pid), 9)
                            print(f"✓ 已停止占用端口 {port} 的进程 (PID: {pid})")
                        except Exception as e:
                            print(f"✗ 停止进程失败: {e}")
    except Exception as e:
        print(f"检查端口 {port} 时出错: {e}")

def main():
    """主函数"""
    print("=" * 50)
    print("Champ Code Academy - 后端启动脚本")
    print("=" * 50)
    
    # 停止占用8000端口的进程
    print("\n清理端口...")
    kill_port(8000)
    
    # 等待一下
    time.sleep(1)
    
    # 启动FastAPI
    print("\n启动FastAPI服务器...")
    print("访问地址: http://localhost:8000")
    print("API文档: http://localhost:8000/docs")
    print("=" * 50)
    print()
    
    # 启动应用
    import uvicorn
    import sys
    import os
    
    # 获取当前脚本所在目录（app目录）
    app_dir = os.path.dirname(os.path.abspath(__file__))
    # 将app目录添加到Python路径
    if app_dir not in sys.path:
        sys.path.insert(0, app_dir)
    
    # 修改工作目录到app目录
    os.chdir(app_dir)
    
    # 设置环境变量，确保子进程也能找到模块
    os.environ['PYTHONPATH'] = app_dir
    
    # 直接导入app对象，避免模块路径解析问题
    from main import app
    
    # 使用导入的app对象运行
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True, reload_dirs=[app_dir])

if __name__ == "__main__":
    main()
