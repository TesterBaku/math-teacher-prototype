#!/usr/bin/env bash
set -euo pipefail

echo "=== Math 5 — starting server ==="

if ! command -v node &>/dev/null; then
  echo "ERROR: Node.js is not installed. Download from https://nodejs.org"
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

if [ ! -f .next/standalone/server.js ]; then
  echo "Building..."
  npm run build
fi

echo ""
echo "Server running at http://localhost:3000"
echo "Press Ctrl+C to stop."
echo ""

export PORT=3000
export HOSTNAME=0.0.0.0
node .next/standalone/server.js
