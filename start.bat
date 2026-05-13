@echo off
setlocal
title Math 5 - Server

echo === Matematika 5 klass ===

where node >nul 2>&1
if %errorlevel% neq 0 (
  echo.
  echo ERROR: Node.js is not installed.
  echo Download from https://nodejs.org ^(choose the LTS version^)
  echo Then re-run this file.
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  npm install
  if %errorlevel% neq 0 ( echo. & echo Install failed. See error above. & pause & exit /b 1 )
)

if not exist .next\standalone\server.js (
  echo Building ^(first run, takes ~30 seconds^)...
  npm run build
  if %errorlevel% neq 0 ( echo. & echo Build failed. See error above. & pause & exit /b 1 )
)

echo.
echo Server starting...
echo Your browser will open automatically in a few seconds.
echo To stop the server, press Ctrl+C in this window.
echo.

set PORT=3000
set HOSTNAME=0.0.0.0

REM Open the browser after a short delay while the server boots
start /b cmd /c "timeout /t 4 /nobreak > nul && start http://localhost:3000"

node .next\standalone\server.js

echo.
echo Server stopped.
pause
