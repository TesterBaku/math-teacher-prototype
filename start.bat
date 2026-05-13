@echo off
setlocal

echo === Math 5 — starting server ===

where node >nul 2>&1
if %errorlevel% neq 0 (
  echo ERROR: Node.js is not installed. Download from https://nodejs.org
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  npm install
  if %errorlevel% neq 0 ( echo npm install failed & pause & exit /b 1 )
)

if not exist .next\standalone\server.js (
  echo Building...
  npm run build
  if %errorlevel% neq 0 ( echo Build failed & pause & exit /b 1 )
)

echo.
echo Server running at http://localhost:3000
echo Press Ctrl+C to stop.
echo.

set PORT=3000
set HOSTNAME=0.0.0.0
node .next\standalone\server.js
