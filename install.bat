@echo off
cls
echo.
echo ====================================================================
echo                    Installing Dependencies
echo ====================================================================
echo.

cd /d "%~dp0"

node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo Running: npm install
call npm install

if errorlevel 1 (
    echo ERROR: Installation failed
) else (
    echo.
    echo SUCCESS! Dependencies installed
    echo.
    echo Next steps:
    echo   - Run dev.bat to start development server
    echo   - Or run build.bat to build for production
)

pause
