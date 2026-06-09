@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Syncing and Pushing to GitHub
echo ========================================
echo.

cd /d "%~dp0"

REM Check if git is initialized
if not exist .git (
    echo Initializing git repository...
    git init
)

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo Adding GitHub remote...
    git remote add origin https://github.com/akranthi113/HirePinnacle50.git
)

echo.
echo Fetching latest from GitHub...
git fetch origin

echo Pulling latest changes...
git pull origin main --allow-unrelated-histories

echo.
echo Staging all changes...
git add .

echo Committing changes...
git commit -m "Update from local: %date% %time%"

echo.
echo ========================================
echo Ready to push to GitHub
echo ========================================
echo.
set /p "proceed=Enter your GitHub username to proceed with push (or press Ctrl+C to cancel): "

echo.
echo Pushing to GitHub...
git branch -M main
git push -u origin main --force-with-lease

if errorlevel 1 (
    echo.
    echo ERROR: Push failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
pause
