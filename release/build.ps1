# Builds math-teacher-release.zip from the current source tree.
#
# Usage (from anywhere):  pwsh release/build.ps1
#
# Output: math-teacher-release.zip in the repo root, ready to attach to a
# GitHub release with `gh release create <tag> math-teacher-release.zip`.
#
# The script derives release-mode start.bat / start.sh from the dev versions
# at the repo root by stripping the dev-only `npm install` / `npm run build`
# branches and re-pointing the final `node` invocation at the top-level
# server.js. Sanity-checks at the end fail loudly if a future refactor breaks
# either transform (rather than silently shipping a broken zip).

[CmdletBinding()]
param(
  # Bypass the working-tree integrity check. Use only if you knowingly want
  # to package locally-modified start scripts (e.g. testing a fix before
  # committing it).
  [switch] $Force
)

$ErrorActionPreference = 'Stop'
$repoRoot = (Resolve-Path "$PSScriptRoot\..").Path
$outZip = Join-Path $repoRoot 'math-teacher-release.zip'

Set-Location $repoRoot

# Refuse to package locally-modified start scripts — a tampered or
# half-edited start.bat / start.sh on disk would silently end up in the zip.
if (-not $Force) {
  & git diff --quiet -- start.bat start.sh
  if ($LASTEXITCODE -ne 0) {
    throw 'Working tree has uncommitted changes to start.bat / start.sh. Commit, stash, or rerun with -Force.'
  }
}

Write-Host "→ Building Next.js standalone output..."
& npm run build
if ($LASTEXITCODE -ne 0) { throw "npm run build failed (exit $LASTEXITCODE)" }

# Stage in a temp dir so a half-built zip never lands in the repo root.
$stage = Join-Path $env:TEMP 'math-teacher-release-stage'
$dest = Join-Path $stage 'math-teacher'
if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Path $dest -Force | Out-Null

# Next standalone nests output under the source folder name. Flatten by
# discovering that folder (don't hardcode the name — survives a rename).
$standaloneSource = Get-ChildItem (Join-Path $repoRoot '.next\standalone') -Directory | Select-Object -First 1
if (-not $standaloneSource) { throw "No standalone output under .next/standalone/. Did npm run build emit it?" }
Copy-Item -Path (Join-Path $standaloneSource.FullName '*') -Destination $dest -Recurse -Force

# .next/static and public/ aren't part of standalone; copy them in.
Copy-Item -Path (Join-Path $repoRoot '.next\static') -Destination (Join-Path $dest '.next\static') -Recurse -Force
$publicDir = Join-Path $repoRoot 'public'
if (Test-Path $publicDir) {
  Copy-Item -Path $publicDir -Destination (Join-Path $dest 'public') -Recurse -Force
}

# Transform start.bat for release mode.
$batDev = Get-Content (Join-Path $repoRoot 'start.bat') -Raw
$batRelease = $batDev `
  -replace '(?s)\r?\nif not exist node_modules \(.*?\r?\n\)', '' `
  -replace '(?s)\r?\nif not exist \.next\\standalone\\server\.js \(.*?\r?\n\)', '' `
  -replace 'node \.next\\standalone\\server\.js', 'node "%~dp0server.js"'
Set-Content -Path (Join-Path $dest 'start.bat') -Value $batRelease -Encoding ASCII -NoNewline

# Transform start.sh for release mode; force LF line endings.
$shDev = Get-Content (Join-Path $repoRoot 'start.sh') -Raw
$shRelease = $shDev `
  -replace '(?s)\r?\nif \[ ! -d node_modules \]; then.*?\r?\nfi', '' `
  -replace '(?s)\r?\nif \[ ! -f \.next/standalone/server\.js \]; then.*?\r?\nfi', '' `
  -replace 'node \.next/standalone/server\.js', 'node "$SCRIPT_DIR/server.js"'
[System.IO.File]::WriteAllText(
  (Join-Path $dest 'start.sh'),
  $shRelease.Replace("`r`n", "`n"),
  (New-Object System.Text.UTF8Encoding $false)
)

# Ship the tracked HOW_TO_RUN.txt template; force LF endings on the way in.
$howto = Get-Content (Join-Path $PSScriptRoot 'HOW_TO_RUN.txt') -Raw
[System.IO.File]::WriteAllText(
  (Join-Path $dest 'HOW_TO_RUN.txt'),
  $howto.Replace("`r`n", "`n"),
  (New-Object System.Text.UTF8Encoding $false)
)

# Sanity: every file we expect to ship made it.
$required = @('server.js', 'package.json', 'node_modules', 'start.bat', 'start.sh', 'HOW_TO_RUN.txt', '.next', 'public')
foreach ($f in $required) {
  if (-not (Test-Path (Join-Path $dest $f))) { throw "Missing in stage: $f" }
}

# Sanity: the release transforms actually applied. If a future start-script
# refactor changes the patterns we strip, we want a build-time failure here
# instead of a release zip that boots into `npm run build` for end users.
# `\b` not `^\s*` — catches single-line idioms like
# `if not exist node_modules call npm install` where `call npm install` isn't
# at line start. The cost is a false positive if a comment in the script
# mentions `npm install` verbatim; we accept that for the regression-defense win.
if ($batRelease -match '\bcall\s+npm\s+install\b' -or $batRelease -match '\bcall\s+npm\s+run\s+build\b') {
  throw 'start.bat transform left dev-only npm install / npm run build in place — regex did not match. Inspect repo-root start.bat for changes.'
}
if ($batRelease -notmatch [regex]::Escape('node "%~dp0server.js"')) {
  throw 'start.bat transform did not re-point the node invocation at server.js'
}
if ($shRelease -match '\bnpm\s+install\b' -or $shRelease -match '\bnpm\s+run\s+build\b') {
  throw 'start.sh transform left dev-only npm install / npm run build in place'
}
if ($shRelease -notmatch [regex]::Escape('node "$SCRIPT_DIR/server.js"')) {
  throw 'start.sh transform did not re-point the node invocation at server.js'
}

# Package.
if (Test-Path $outZip) { Remove-Item $outZip -Force }
Compress-Archive -Path (Join-Path $stage 'math-teacher') -DestinationPath $outZip -CompressionLevel Optimal
Remove-Item $stage -Recurse -Force

$info = Get-Item $outZip
$sha = (Get-FileHash $outZip -Algorithm SHA256).Hash
Write-Host ""
Write-Host "Built $($info.FullName)"
Write-Host "  Size:   $([math]::Round($info.Length / 1MB, 2)) MB"
Write-Host "  SHA256: $sha"
Write-Host ""
Write-Host "Next: gh release create vX.Y.Z math-teacher-release.zip --title '...' --notes '...'"
