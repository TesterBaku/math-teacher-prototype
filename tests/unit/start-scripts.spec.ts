import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const REPO_ROOT = join(__dirname, '..', '..');
const startBat = readFileSync(join(REPO_ROOT, 'start.bat'), 'utf8');
const startSh = readFileSync(join(REPO_ROOT, 'start.sh'), 'utf8');

test.describe('start.bat — guards against past regressions', () => {
  test('enables delayed expansion (otherwise %errorlevel% is parse-time inside parens)', () => {
    expect(startBat).toMatch(/^\s*setlocal\s+enabledelayedexpansion\b/im);
  });

  test('errorlevel checks inside parenthesized blocks use !errorlevel!, not %errorlevel%', () => {
    // The only safe %errorlevel% in this script is the top-level check after `where node`.
    // Everything inside an outer (...) block must use !errorlevel! because % is parse-time.
    const percentMatches = startBat.match(/%errorlevel%/g) || [];
    expect(
      percentMatches.length,
      'Found multiple %errorlevel% — only the top-level post-`where node` check should remain; all in-block checks must use !errorlevel!'
    ).toBeLessThanOrEqual(1);
    expect(startBat).toMatch(/!errorlevel!/);
  });

  test('no apostrophe-vulnerable single-quoted batch paths in PowerShell payload', () => {
    // Patterns like '%TEMP%\...' break PS parsing when the path contains an apostrophe.
    expect(startBat, "found '%TEMP% — apostrophe in path will break PowerShell").not.toMatch(/'%TEMP%/);
    expect(startBat, "found '%~dp0 — apostrophe in path will break PowerShell").not.toMatch(/'%~dp0/);
    expect(startBat, "found '%NODE_ — apostrophe in path will break PowerShell").not.toMatch(/'%NODE_/);
  });

  test('PowerShell payload reads paths from environment variables ($env:VAR bridge)', () => {
    expect(startBat).toMatch(/\$env:PS_TEMP\b/);
    expect(startBat).toMatch(/\$env:PS_DEST\b/);
    expect(startBat).toMatch(/\$env:PS_URL\b/);
    expect(startBat).toMatch(/\$env:PS_SHA256\b/);
  });

  test('verifies SHA256 of the downloaded zip before extracting', () => {
    expect(startBat).toMatch(/Get-FileHash/);
    expect(startBat).toMatch(/SHA256 mismatch/);
    const hashIdx = startBat.indexOf('Get-FileHash');
    const extractIdx = startBat.indexOf('Expand-Archive');
    expect(hashIdx, 'Get-FileHash must appear before Expand-Archive').toBeGreaterThan(-1);
    expect(extractIdx, 'Expand-Archive must appear in the payload').toBeGreaterThan(-1);
    expect(hashIdx).toBeLessThan(extractIdx);
  });

  test('existing node-portable is removed only AFTER successful extract (stage-then-replace)', () => {
    const extractIdx = startBat.indexOf('Expand-Archive');
    const destRemoveIdx = startBat.indexOf('Remove-Item $env:PS_DEST');
    expect(destRemoveIdx, 'must remove $env:PS_DEST').toBeGreaterThan(-1);
    expect(destRemoveIdx, 'destination must be deleted only after extract succeeds').toBeGreaterThan(extractIdx);
  });

  test('npm invocations use `call` (otherwise batch terminates after npm.cmd)', () => {
    expect(startBat).toMatch(/\bcall\s+npm\s+install\b/);
    expect(startBat).toMatch(/\bcall\s+npm\s+run\s+build\b/);
    // No bare `npm install` / `npm run build` at the start of a line.
    expect(startBat).not.toMatch(/^[ \t]*npm\s+install\b/m);
    expect(startBat).not.toMatch(/^[ \t]*npm\s+run\s+build\b/m);
  });

  test('pinned NODE_SHA256 is exactly 64 lowercase hex characters', () => {
    const m = startBat.match(/^\s*set\s+NODE_SHA256=([^\s]+)/im);
    expect(m, 'NODE_SHA256 must be defined').toBeTruthy();
    expect(m![1]).toMatch(/^[a-f0-9]{64}$/);
  });
});

test.describe('start.sh — guards against past regressions', () => {
  test('runs under set -euo pipefail', () => {
    expect(startSh).toMatch(/^\s*set\s+-euo\s+pipefail\b/m);
  });

  test('every indirect expansion uses a default (set -u safe)', () => {
    // ${!var} without a `:-` / `-` / `:?` default crashes under set -u when var is unset.
    // Allowed forms: ${!var:-...}, ${!var-...}, ${!var:?...}, ${!var?...}
    const unsafeIndirect = startSh.match(/\$\{![A-Za-z_][A-Za-z_0-9]*\}/g) || [];
    expect(
      unsafeIndirect,
      'bare ${!var} crashes under set -u; use ${!var:-} to demote unset to empty'
    ).toEqual([]);
    // And specifically the sha lookup must use the safe form:
    expect(startSh).toMatch(/\$\{!sha_var:-\}/);
  });

  test('uses a local work_dir variable, not the standard POSIX TMPDIR env var', () => {
    expect(startSh, 'must not clobber the POSIX TMPDIR env var').not.toMatch(
      /^\s*TMPDIR\s*=\s*"?\$\(mktemp\b/m
    );
    expect(startSh).toMatch(/work_dir\s*=\s*"?\$\(mktemp\b/);
  });

  test('mktemp allocates under SCRIPT_DIR so the final mv is same-FS atomic', () => {
    expect(startSh, 'mktemp must be inside SCRIPT_DIR to keep mv atomic').toMatch(
      /mktemp\s+-d\s+["']?\$SCRIPT_DIR\//
    );
  });

  test('verifies SHA256 of the downloaded tarball before extracting', () => {
    expect(startSh).toMatch(/sha256sum|shasum\s+-a\s+256/);
    expect(startSh).toMatch(/SHA256 mismatch/);
    // Ordering: hash check before `tar -xJf`.
    const candidates = [startSh.indexOf('sha256sum'), startSh.indexOf('shasum -a 256')].filter(
      (i) => i !== -1
    );
    const hashIdx = Math.min(...candidates);
    const extractIdx = startSh.indexOf('tar -xJf');
    expect(extractIdx, 'tar -xJf must appear').toBeGreaterThan(-1);
    expect(hashIdx, 'hash check must appear before extract').toBeLessThan(extractIdx);
  });

  test('existing node-portable is removed only AFTER successful extract (stage-then-replace)', () => {
    const extractIdx = startSh.indexOf('tar -xJf');
    const destRemoveIdx = startSh.indexOf('rm -rf "$SCRIPT_DIR/node-portable"');
    expect(destRemoveIdx, 'must remove existing node-portable').toBeGreaterThan(-1);
    expect(destRemoveIdx).toBeGreaterThan(extractIdx);
  });

  test('pinned per-platform SHA256s are 64 lowercase hex characters and cover all 4 OS/arch combos', () => {
    const pinned = startSh.match(/^NODE_SHA256_\w+\s*=\s*"([a-f0-9]+)"/gm) || [];
    expect(pinned.length, 'expected SHA256 for darwin/linux × x64/arm64 — 4 combos').toBe(4);
    for (const line of pinned) {
      const m = line.match(/="([a-f0-9]+)"/);
      expect(m![1]).toMatch(/^[a-f0-9]{64}$/);
    }
    // And the four expected variable names exist:
    expect(startSh).toMatch(/^NODE_SHA256_darwin_x64\s*=/m);
    expect(startSh).toMatch(/^NODE_SHA256_darwin_arm64\s*=/m);
    expect(startSh).toMatch(/^NODE_SHA256_linux_x64\s*=/m);
    expect(startSh).toMatch(/^NODE_SHA256_linux_arm64\s*=/m);
  });
});

test.describe('start scripts — shared invariants', () => {
  test('both scripts pin the same NODE_VERSION', () => {
    const batVer = startBat.match(/^\s*set\s+NODE_VERSION=(\S+)/im)?.[1];
    const shVer = startSh.match(/^\s*NODE_VERSION\s*=\s*"([^"]+)"/m)?.[1];
    expect(batVer, 'start.bat NODE_VERSION').toBeTruthy();
    expect(shVer, 'start.sh NODE_VERSION').toBeTruthy();
    expect(batVer).toBe(shVer);
  });
});
