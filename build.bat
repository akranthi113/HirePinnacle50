@echo off
cd /d "%~dp0"
npm run build
echo.
echo Build complete! Check 'dist' folder
pause
