# Git 发布脚本
Write-Host "🚀 开始发布到 GitHub..." -ForegroundColor Cyan

$ErrorActionPreference = "Stop"

# 1. 清理旧的 Git
Write-Host "`n1. 清理环境..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Remove-Item -Recurse -Force .git
    Write-Host "   ✓ 清理完成" -ForegroundColor Green
}

# 2. 初始化 Git
Write-Host "`n2. 初始化 Git..." -ForegroundColor Yellow
git init
git branch -M main
Write-Host "   ✓ Git 初始化完成" -ForegroundColor Green

# 3. 配置 Git 用户
Write-Host "`n3. 配置 Git 用户..." -ForegroundColor Yellow
git config user.name "liuzhihaotina"
git config user.email "liuzhihaotina@users.noreply.github.com"
Write-Host "   ✓ 配置完成" -ForegroundColor Green

# 4. 添加所有文件
Write-Host "`n4. 添加文件..." -ForegroundColor Yellow
git add .
Write-Host "   ✓ 文件已添加" -ForegroundColor Green

# 5. 提交
Write-Host "`n5. 创建提交..." -ForegroundColor Yellow
git commit -m "🎉 Initial commit: Pi Multimodal Router Extension v0.2.0

Features:
- Smart provider routing with Apidock support
- Vision understanding fallback for text-only models  
- Image generation with auto-fallback mechanism
- Support for Apidock/gpt-image-2 and SiliconFlow
- Comprehensive documentation and testing

Tech Stack:
- TypeScript (~750 lines)
- Pi Extension API
- SiliconFlow API
- Modular architecture

Documentation:
- Complete README with examples
- Contributing guidelines
- Security policy
- Testing guide
- Smart routing explanation"

Write-Host "   ✓ 提交创建完成" -ForegroundColor Green

# 6. 添加远程仓库
Write-Host "`n6. 添加远程仓库..." -ForegroundColor Yellow
git remote add origin git@github.com:liuzhihaotina/pi-multimodal-router.git
Write-Host "   ✓ 远程仓库已添加" -ForegroundColor Green

# 7. 推送到 GitHub
Write-Host "`n7. 推送到 GitHub..." -ForegroundColor Yellow
Write-Host "   正在推送 main 分支..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ 推送成功！" -ForegroundColor Green
} else {
    Write-Host "   ✗ 推送失败，请检查 SSH 密钥配置" -ForegroundColor Red
    exit 1
}

# 8. 创建标签
Write-Host "`n8. 创建版本标签..." -ForegroundColor Yellow
git tag -a v0.2.0 -m "Release v0.2.0: Smart Provider Routing"
git push origin v0.2.0

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ 标签已创建并推送" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ 标签推送失败（可在 GitHub 网页创建 Release）" -ForegroundColor Yellow
}

Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎉 发布完成！" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "仓库地址: https://github.com/liuzhihaotina/pi-multimodal-router" -ForegroundColor White
Write-Host ""
Write-Host "下一步：" -ForegroundColor Yellow
Write-Host "1. 访问 GitHub 仓库" -ForegroundColor White
Write-Host "2. 配置 Topics 和 Description" -ForegroundColor White
Write-Host "3. 启用 Issues 和 Discussions" -ForegroundColor White
Write-Host "4. 创建 Release (如果标签推送失败)" -ForegroundColor White
Write-Host ""
