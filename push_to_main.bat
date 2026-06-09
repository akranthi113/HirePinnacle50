@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Setting up and Pushing to GitHub
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
echo Staging all changes...
git add .

echo Committing changes...
git commit -m "Update from local: %date% %time%"

echo.
echo Setting up tracking and pushing...
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo.
    echo Pushing to master branch...
    git push -u origin master
)

echo.
echo ========================================
echo   Done! Changes pushed to GitHub
echo ========================================
echo.
pause
