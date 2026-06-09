@echo off
title AKV Technologies Recruitment Management System
echo ====================================================================
echo Starting AKV Technologies Recruitment Management System...
echo ====================================================================
echo.
echo [1/2] Opening default web browser to http://localhost:5173...
start http://localhost:5173
echo.
echo [2/2] Starting local Vite development server...
echo Press Ctrl+C in this window to stop the server at any time.
echo.
npm run dev
pause
