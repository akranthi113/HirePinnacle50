@echo off
cls
echo.
echo ====================================================================
echo                    Pushing to GitHub
echo ====================================================================
echo.

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
echo Pushing to GitHub (you may be asked for credentials)...
git branch -M main
git push -u origin main --force-with-lease

if errorlevel 1 (
    echo.
    echo ERROR: Push failed
) else (
    echo.
    echo SUCCESS! Pushed to GitHub
)

pause

