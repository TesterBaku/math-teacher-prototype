@echo off
setlocal enabledelayedexpansion
title Math 5 - Server

echo === Matematika 5 klass ===

REM Pinned Node.js LTS (Jod). To bump the bundled runtime, update both lines
REM below — the hash must be taken from the authoritative SHASUMS256.txt for
REM that version (https://nodejs.org/dist/<version>/SHASUMS256.txt). Hardcoding
REM (instead of fetching) defends against TLS-inspecting proxies common on
REM school/corporate networks: an attacker can MITM both the .zip and the
REM .txt fetched from the same host, but cannot rewrite this committed file.
set NODE_VERSION=v22.11.0
set NODE_SHA256=905373a059aecaf7f48c1ce10ffbd5334457ca00f678747f19db5ea7d256c236
set NODE_DIR=node-%NODE_VERSION%-win-x64
set NODE_ZIP=%NODE_DIR%.zip
set NODE_URL=https://nodejs.org/dist/%NODE_VERSION%/%NODE_ZIP%

REM Prefer a previously-extracted portable copy next to this script.
if exist "%~dp0node-portable\node.exe" set "PATH=%~dp0node-portable;%PATH%"

where node >nul 2>&1
if %errorlevel% neq 0 (
  echo.
  echo Node.js not found. Downloading a portable copy ^(~33 MB^)...
  echo One-time setup. No admin rights required.
  echo.

  REM Paths passed as env vars so PowerShell reads them as runtime values
  REM instead of embedding them into a single-quoted string at script-build
  REM time — necessary because home dirs can contain characters like ' that
  REM would otherwise terminate the PS string mid-path.
  set "PS_URL=%NODE_URL%"
  set "PS_TEMP=%TEMP%"
  set "PS_ZIP=%NODE_ZIP%"
  set "PS_DIR=%NODE_DIR%"
  set "PS_DEST=%~dp0node-portable"
  set "PS_SHA256=%NODE_SHA256%"

  powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; $ErrorActionPreference='Stop'; try { $zip = Join-Path $env:PS_TEMP $env:PS_ZIP; $extract = Join-Path $env:PS_TEMP 'node-extract'; if (Test-Path $extract) { Remove-Item $extract -Recurse -Force }; if (Test-Path $env:PS_DEST) { Remove-Item $env:PS_DEST -Recurse -Force }; Invoke-WebRequest -Uri $env:PS_URL -OutFile $zip -UseBasicParsing; $actual = (Get-FileHash -Path $zip -Algorithm SHA256).Hash.ToLower(); $expected = $env:PS_SHA256.ToLower(); if ($actual -ne $expected) { Remove-Item $zip -Force -ErrorAction SilentlyContinue; throw \"SHA256 mismatch for $env:PS_ZIP. Expected $expected, got $actual.\" }; Expand-Archive -Path $zip -DestinationPath $extract -Force; Move-Item -Path (Join-Path $extract $env:PS_DIR) -Destination $env:PS_DEST -Force; Remove-Item $zip -Force; Remove-Item $extract -Recurse -Force; exit 0 } catch { Write-Host $_.Exception.Message; exit 1 }"

  if !errorlevel! neq 0 (
    echo.
    echo Node.js download failed. Check your internet connection and try again.
    echo Or install Node.js LTS manually from https://nodejs.org
    pause
    exit /b 1
  )

  set "PATH=%~dp0node-portable;%PATH%"
  echo Node.js installed locally at %~dp0node-portable
  echo.
)

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if !errorlevel! neq 0 ( echo. & echo Install failed. See error above. & pause & exit /b 1 )
)

if not exist .next\standalone\server.js (
  echo Building ^(first run, takes ~30 seconds^)...
  call npm run build
  if !errorlevel! neq 0 ( echo. & echo Build failed. See error above. & pause & exit /b 1 )
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
