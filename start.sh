#!/usr/bin/env bash
set -euo pipefail

echo "=== Matematika 5 klass ==="

# Pinned Node.js LTS (Jod). Update this single line to bump the bundled runtime.
NODE_VERSION="v22.11.0"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Prefer a previously-extracted portable copy next to this script.
if [ -x "$SCRIPT_DIR/node-portable/bin/node" ]; then
  export PATH="$SCRIPT_DIR/node-portable/bin:$PATH"
fi

if ! command -v node &>/dev/null; then
  echo ""
  echo "Node.js not found. Downloading a portable copy (~30 MB)..."
  echo "One-time setup. No admin rights required."
  echo ""

  case "$(uname -s)" in
    Darwin) OS="darwin" ;;
    Linux)  OS="linux" ;;
    *) echo "Unsupported OS: $(uname -s). Install Node.js manually from https://nodejs.org"; exit 1 ;;
  esac

  case "$(uname -m)" in
    x86_64|amd64)   ARCH="x64" ;;
    arm64|aarch64)  ARCH="arm64" ;;
    *) echo "Unsupported architecture: $(uname -m). Install Node.js manually from https://nodejs.org"; exit 1 ;;
  esac

  NODE_PKG="node-${NODE_VERSION}-${OS}-${ARCH}"
  NODE_TAR="${NODE_PKG}.tar.xz"
  NODE_URL="https://nodejs.org/dist/${NODE_VERSION}/${NODE_TAR}"

  TMPDIR="$(mktemp -d)"
  trap 'rm -rf "$TMPDIR"' EXIT

  if command -v curl &>/dev/null; then
    curl -fsSL "$NODE_URL" -o "$TMPDIR/$NODE_TAR"
  elif command -v wget &>/dev/null; then
    wget -q "$NODE_URL" -O "$TMPDIR/$NODE_TAR"
  else
    echo "Neither curl nor wget is available. Install Node.js manually from https://nodejs.org"
    exit 1
  fi

  tar -xJf "$TMPDIR/$NODE_TAR" -C "$TMPDIR"
  mv "$TMPDIR/$NODE_PKG" "$SCRIPT_DIR/node-portable"

  export PATH="$SCRIPT_DIR/node-portable/bin:$PATH"
  echo "Node.js installed locally at $SCRIPT_DIR/node-portable"
  echo ""
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
