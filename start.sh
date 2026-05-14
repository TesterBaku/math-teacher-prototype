#!/usr/bin/env bash
set -euo pipefail

echo "=== Matematika 5 klass ==="

# Pinned Node.js LTS (Jod). To bump the bundled runtime, update the version AND
# the per-platform SHA256s below. Hashes come from the authoritative
# SHASUMS256.txt for that version (https://nodejs.org/dist/<version>/SHASUMS256.txt).
# Hardcoding (instead of fetching) defends against TLS-inspecting proxies common
# on school/corporate networks: an attacker can MITM both the tarball and the
# .txt fetched from the same host, but cannot rewrite this committed file.
NODE_VERSION="v22.11.0"
NODE_SHA256_darwin_x64="ab28d1784625d151e3f608a9412a009118f376118ed842ae643f8c2efdfb0af6"
NODE_SHA256_darwin_arm64="c379a90c6aa605b74042a233ddcda4247b347ba5732007d280e44422cc8f9ecb"
NODE_SHA256_linux_x64="83bf07dd343002a26211cf1fcd46a9d9534219aad42ee02847816940bf610a72"
NODE_SHA256_linux_arm64="6031d04b98f59ff0f7cb98566f65b115ecd893d3b7870821171708cdbaf7ae6e"
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

  # Look up the pinned SHA256 for this OS/arch combo.
  sha_var="NODE_SHA256_${OS}_${ARCH}"
  expected_sha="${!sha_var}"
  if [ -z "$expected_sha" ]; then
    echo "No pinned SHA256 for ${OS}/${ARCH} — refusing to install Node.js."
    exit 1
  fi

  # mktemp under SCRIPT_DIR so the final mv stays on the same filesystem and
  # is therefore atomic (mv across filesystems falls back to copy+unlink and
  # can leave a partially-populated destination if interrupted).
  work_dir="$(mktemp -d "$SCRIPT_DIR/.node-install.XXXXXX")"
  trap 'rm -rf "$work_dir"' EXIT

  if command -v curl &>/dev/null; then
    curl -fsSL "$NODE_URL" -o "$work_dir/$NODE_TAR"
  elif command -v wget &>/dev/null; then
    wget -q "$NODE_URL" -O "$work_dir/$NODE_TAR"
  else
    echo "Neither curl nor wget is available. Install Node.js manually from https://nodejs.org"
    exit 1
  fi

  # Verify SHA256 before extract.
  if command -v sha256sum &>/dev/null; then
    actual_sha="$(sha256sum "$work_dir/$NODE_TAR" | awk '{print $1}')"
  elif command -v shasum &>/dev/null; then
    actual_sha="$(shasum -a 256 "$work_dir/$NODE_TAR" | awk '{print $1}')"
  else
    echo "Neither sha256sum nor shasum is available — refusing to install unverified Node.js."
    exit 1
  fi
  if [ "$actual_sha" != "$expected_sha" ]; then
    echo "SHA256 mismatch for $NODE_TAR. Expected $expected_sha, got $actual_sha."
    exit 1
  fi

  tar -xJf "$work_dir/$NODE_TAR" -C "$work_dir"
  # mv into an existing directory nests instead of replacing — clear first.
  rm -rf "$SCRIPT_DIR/node-portable"
  mv "$work_dir/$NODE_PKG" "$SCRIPT_DIR/node-portable"

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
