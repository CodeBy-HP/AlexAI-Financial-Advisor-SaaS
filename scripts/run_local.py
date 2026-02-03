#!/usr/bin/env python3
"""
Run both frontend and backend locally for development.
This script starts the NextJS frontend and FastAPI backend in parallel.
"""

import os
import sys
import subprocess
import signal
import time
import shutil
import socket
from pathlib import Path

# Track subprocesses for cleanup
processes = []

def cleanup(signum=None, frame=None):
    """Clean up all subprocess on exit"""
    print("\n🛑 Shutting down services...")
    for proc in processes:
        try:
            proc.terminate()
            proc.wait(timeout=5)
        except:
            proc.kill()
    sys.exit(0)

# Register cleanup handlers
signal.signal(signal.SIGINT, cleanup)
signal.signal(signal.SIGTERM, cleanup)

def check_requirements():
    """Check if required tools are installed"""
    checks = []

    # Check Node.js
    if shutil.which("node"):
        try:
            result = subprocess.run(["node", "--version"], capture_output=True, text=True, shell=True)
            node_version = result.stdout.strip()
            checks.append(f"✅ Node.js: {node_version}")
        except Exception as e:
            checks.append(f"❌ Node.js error: {e}")
    else:
        checks.append("❌ Node.js not found - please install Node.js")

    # Check npm
    if shutil.which("npm"):
        try:
            result = subprocess.run(["npm", "--version"], capture_output=True, text=True, shell=True)
            npm_version = result.stdout.strip()
            checks.append(f"✅ npm: {npm_version}")
        except Exception as e:
            checks.append(f"❌ npm error: {e}")
    else:
        checks.append("❌ npm not found - please install npm")

    # Check uv (which manages Python for us)
    if shutil.which("uv"):
        try:
            result = subprocess.run(["uv", "--version"], capture_output=True, text=True, shell=True)
            uv_version = result.stdout.strip()
            checks.append(f"✅ uv: {uv_version}")
        except Exception as e:
            checks.append(f"❌ uv error: {e}")
    else:
        checks.append("❌ uv not found - please install uv")

    print("\n📋 Prerequisites Check:")
    for check in checks:
        print(f"  {check}")

    # Exit if any critical tools are missing
    if any("❌" in check for check in checks):
        print("\n⚠️  Please install missing dependencies and try again.")
        sys.exit(1)

def check_env_files():
    """Check if environment files exist"""
    project_root = Path(__file__).parent.parent

    root_env = project_root / ".env"
    frontend_env = project_root / "frontend" / ".env.local"

    missing = []

    if not root_env.exists():
        missing.append(".env (root project file)")
    if not frontend_env.exists():
        missing.append("frontend/.env.local")

    if missing:
        print("\n⚠️  Missing environment files:")
        for file in missing:
            print(f"  - {file}")
        print("\nPlease create these files with the required configuration.")
        print("The root .env should have all backend variables from Parts 1-7.")
        print("The frontend/.env.local should have Clerk keys.")
        sys.exit(1)

    print("✅ Environment files found")

def is_port_in_use(port):
    """Check if a port is already in use"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(('localhost', port))
            return False
        except OSError:
            return True

def check_ports():
    """Check if required ports are available"""
    ports_in_use = []
    
    if is_port_in_use(8000):
        ports_in_use.append(8000)
    if is_port_in_use(3000):
        ports_in_use.append(3000)
    
    if ports_in_use:
        print(f"\n⚠️  Ports already in use: {', '.join(map(str, ports_in_use))}")
        print("\nPlease stop the existing services before starting new ones:")
        if 8000 in ports_in_use:
            print("  Backend (port 8000): Look for a running FastAPI/uvicorn process")
        if 3000 in ports_in_use:
            print("  Frontend (port 3000): Look for a running Next.js process")
        
        # On Windows, show how to find and kill the processes
        if sys.platform == 'win32':
            print("\nTo find and kill processes on Windows:")
            if 8000 in ports_in_use:
                print("  netstat -ano | findstr :8000")
                print("  taskkill /F /PID <PID>")
            if 3000 in ports_in_use:
                print("  netstat -ano | findstr :3000")
                print("  taskkill /F /PID <PID>")
        
        response = input("\nDo you want to continue anyway? (y/N): ").strip().lower()
        if response != 'y':
            sys.exit(1)

def start_backend():
    """Start the FastAPI backend"""
    backend_dir = Path(__file__).parent.parent / "backend" / "api"

    print("\n🚀 Starting FastAPI backend...")

    # Check if dependencies are installed
    if not (backend_dir / ".venv").exists() and not (backend_dir / "uv.lock").exists():
        print("  Installing backend dependencies...")
        subprocess.run(["uv", "sync"], cwd=backend_dir, check=True, shell=True)

    # Start the backend
    proc = subprocess.Popen(
        ["uv", "run", "main.py"],
        cwd=backend_dir,
        shell=True,
        creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if sys.platform == 'win32' else 0
    )
    processes.append(proc)

    # Wait for backend to start
    print("  Waiting for backend to start...")
    for _ in range(30):  # 30 second timeout
        try:
            import httpx
            response = httpx.get("http://localhost:8000/health")
            if response.status_code == 200:
                print("  ✅ Backend running at http://localhost:8000")
                print("     API docs: http://localhost:8000/docs")
                return proc
        except:
            time.sleep(1)

    print("  ❌ Backend failed to start")
    cleanup()

def start_frontend():
    """Start the NextJS frontend"""
    frontend_dir = Path(__file__).parent.parent / "frontend"

    print("\n🚀 Starting NextJS frontend...")

    # Check if dependencies are installed
    if not (frontend_dir / "node_modules").exists():
        print("  Installing frontend dependencies...")
        subprocess.run(["npm", "install"], cwd=frontend_dir, check=True, shell=True)

    # Start the frontend
    proc = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=frontend_dir,
        shell=True,
        creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if sys.platform == 'win32' else 0
    )
    processes.append(proc)

    # Wait for frontend to start
    print("  Waiting for frontend to start...")
    import httpx

    for i in range(30):  # 30 second timeout
        try:
            response = httpx.get("http://localhost:3000", timeout=1)
            print("  ✅ Frontend running at http://localhost:3000")
            return proc
        except httpx.ConnectError:
            pass  # Server not ready yet
        except:
            # Any other response means server is up
            print("  ✅ Frontend running at http://localhost:3000")
            return proc

        time.sleep(1)

    print("  ❌ Frontend failed to start")
    cleanup()

def monitor_processes():
    """Monitor running processes and show their output"""
    print("\n" + "="*60)
    print("🎯 Alex Financial Advisor - Local Development")
    print("="*60)
    print("\n📍 Services:")
    print("  Frontend: http://localhost:3000")
    print("  Backend:  http://localhost:8000")
    print("  API Docs: http://localhost:8000/docs")
    print("\n📝 Both services are running. Press Ctrl+C to stop.\n")
    print("="*60 + "\n")

    # Monitor processes
    while True:
        all_running = True
        for i, proc in enumerate(processes):
            # Check if process is still running
            status = proc.poll()
            if status is not None:
                service_name = "backend" if i == 0 else "frontend"
                print(f"\n⚠️  {service_name} process has stopped unexpectedly (exit code: {status})!")
                cleanup()
                all_running = False
                break

        if all_running:
            time.sleep(1)  # Check every second

def main():
    """Main entry point"""
    print("\n🔧 Alex Financial Advisor - Local Development Setup")
    print("="*50)

    # Check prerequisites
    check_requirements()
    check_env_files()
    check_ports()

    # Install httpx if needed
    try:
        import httpx
    except ImportError:
        print("\n📦 Installing httpx for health checks...")
        subprocess.run(["uv", "add", "httpx"], check=True)

    # Start services
    backend_proc = start_backend()
    frontend_proc = start_frontend()

    # Monitor processes
    try:
        monitor_processes()
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main()