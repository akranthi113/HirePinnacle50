@echo off
cls
title HirePinnacle50 Development Server
echo.
echo ====================================================================
echo         HirePinnacle50 - Starting Development Server
echo ====================================================================
echo.
cd /d "%~dp0"

echo Checking for Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    echo Download from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js found!
echo.
echo Installing dependencies if needed...
if not exist node_modules (
    echo Running: npm install
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed
        pause
        exit /b 1
    )
)

echo.
echo Dependencies ready!
echo.
echo Opening browser to http://localhost:5173...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo Starting development server...
echo Type Ctrl+C to stop
echo.
call npm run dev

pause
