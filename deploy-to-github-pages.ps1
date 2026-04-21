# 手动部署到 GitHub Pages 的 gh-pages 分支
# 使用方法: .\deploy-to-github-pages.ps1

$ErrorActionPreference = "Stop"

# 配置
$GITHUB_USERNAME = "YOUR_USERNAME"  # 替换为您的 GitHub 用户名
$REPO_NAME = "YOUR_REPO"            # 替换为您的仓库名

# 添加 Hugo 到 PATH
$env:Path += ";$HOME\go\bin"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploy to GitHub Pages" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 第 1 步：构建网站
Write-Host "Step 1: Building Hugo site..." -ForegroundColor Yellow
hugo --minify --gc --baseURL "https://$GITHUB_USERNAME.github.io/$REPO_NAME/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Hugo build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Site built successfully" -ForegroundColor Green

# 第 2 步：切换到 public 目录
Write-Host ""
Write-Host "Step 2: Preparing deployment..." -ForegroundColor Yellow
Set-Location public

# 第 3 步：初始化 Git（如果还没有）
if (-not (Test-Path ".git")) {
    git init
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
}

# 第 4 步：切换到 gh-pages 分支
git checkout --orphan gh-pages 2>$null
if ($LASTEXITCODE -ne 0) {
    git checkout gh-pages
}

# 第 5 步：添加所有文件
git add -A
git commit -m "Deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# 第 6 步：推送到 GitHub
Write-Host ""
Write-Host "Step 3: Deploying to GitHub Pages..." -ForegroundColor Yellow
git push -f origin gh-pages

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Deployment failed!" -ForegroundColor Red
    exit 1
}

# 返回原目录
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your site is live at:" -ForegroundColor Green
Write-Host "https://$GITHUB_USERNAME.github.io/$REPO_NAME/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: First deployment may take 5-10 minutes to propagate" -ForegroundColor Yellow
Write-Host ""
