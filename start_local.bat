@echo off
title HirePinnacle50 - Development Server
echo ====================================================================
echo Starting HirePinnacle50 Development Server
echo ====================================================================
echo.

REM Check if node_modules exists, if not install dependencies
if not exist node_modules (
    echo Installing dependencies (this will run once)...
    echo.
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        echo Make sure Node.js is installed: https://nodejs.org/
        pause
        exit /b 1
    )
    echo.
)

echo [1/2] Opening browser to http://localhost:5173...
start http://localhost:5173
echo.
echo [2/2] Starting Vite development server...
echo Press Ctrl+C to stop the server.
echo.
call npm run dev
pause
