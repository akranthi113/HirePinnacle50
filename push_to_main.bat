@echo off
cls
echo.
@echo off
cls
echo.
echo ====================================================================
echo                    Pushing to GitHub
echo ====================================================================
echo.

:: Simple push script – uses stored git credentials
set REPO_URL=git@github.com:akranthi113/HirePinnacle50.git

cd /d "%~dp0"

git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed
    echo Download from: https://git-scm.com/
    pause
    exit /b 1
)

echo Fetching latest...
git fetch origin

echo Pulling latest changes...
git pull origin main --allow-unrelated-histories

echo.
echo Staging all changes...
git add .

echo Committing...
git commit -m "Update: %date% %time%"

echo.
echo Pushing to GitHub...
git push git@github.com:akranthi113/HirePinnacle50.git main

if errorlevel 1 (
    echo.
    echo ERROR: Push failed
) else (
    echo.
    echo SUCCESS! Pushed to GitHub
)

pause
