param([string]$RepoName = "selsabil-delivery")
$ErrorActionPreference = "Stop"
Set-Location (Split-Path -Parent $PSScriptRoot)
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw "Install Git first: https://git-scm.com/downloads" }
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw "Install GitHub CLI first: https://cli.github.com/" }
gh auth status
if ($LASTEXITCODE -ne 0) { throw "Run: gh auth login" }
if (-not (Test-Path .git)) { git init -b main }
git add -A
$changes = git status --porcelain
if ($changes) { git commit -m "Initial Selsabil Delivery demo and Pages deployment" }
if ($LASTEXITCODE -ne 0) { throw "Unable to commit; configure git user.name and user.email" }
gh repo create $RepoName --public --source=. --remote=origin --push
if ($LASTEXITCODE -ne 0) { throw "Repository creation/push failed. No remote repo was confirmed." }
Write-Host "Repository created. Enable GitHub Pages under Settings > Pages > Source: GitHub Actions."
