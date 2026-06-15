@echo off
cls

:: ------------------------------------------------------------
:: Push to GitHub (HTTPS) script
:: ------------------------------------------------------------

:: Set the repository URL. Use HTTPS for safer authentication.
:: If you have a GitHub Personal Access Token (PAT), you can embed it like:
:: set REPO_URL=https://<TOKEN>@github.com/akranthi113/HirePinnacle50.git
:: Otherwise, you will be prompted for username/password (or use cached credentials).
set REPO_URL=https://github.com/akranthi113/HirePinnacle50.git

:: Change to script directory
cd /d "%~dp0"

:: Verify git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed. Install from https://git-scm.com/
    pause
    exit /b 1
)

echo Fetching latest changes...
git fetch origin

echo Pulling latest changes (allowing unrelated histories)...
git pull origin main --allow-unrelated-histories

echo Staging all changes...
git add .

:: Commit only if there are changes
git diff-index --quiet HEAD || (
    echo Committing changes...
    git commit -m "Update: %date% %time%"
)

echo Pushing to GitHub...
git push "%REPO_URL%" main

if errorlevel 1 (
    echo.
    echo ERROR: Push failed. Check your credentials or network connection.
) else (
    echo.
    echo SUCCESS! Pushed to GitHub.
)

pause
