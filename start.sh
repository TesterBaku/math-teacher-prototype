#!/usr/bin/env bash
set -euo pipefail

echo "=== Matematika 5 klass ==="

if ! command -v node &>/dev/null; then
  echo ""
  echo "ERROR: Node.js is not installed."
  echo "Download from https://nodejs.org (choose the LTS version)"
  echo "Then re-run this script."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

if [ ! -f .next/standalone/server.js ]; then
  echo "Building (first run, takes ~30 seconds)..."
  npm run build
fi

echo ""
echo "Server starting..."
echo "Your browser will open automatically in a few seconds."
echo "To stop the server, press Ctrl+C."
echo ""

export PORT=3000
export HOSTNAME=0.0.0.0

# Open the browser after a short delay while the server boots
(sleep 4 && open "http://localhost:3000" 2>/dev/null || \
           xdg-open "http://localhost:3000" 2>/dev/null || true) &

node .next/standalone/server.js

echo ""
echo "Server stopped."
